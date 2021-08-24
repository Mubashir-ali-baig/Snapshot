import {
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  NonfungiblePositionManager,
  NonfungiblePositionManager__positionsResult,
  Transfer,
} from "../generated/NonfungiblePositionManager/NonfungiblePositionManager";
import {
  ADDRESS_ZERO,
  factoryContract,
  PILOT_ADDRESS,
  SNAPSHOT_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from "./utils/constants";
import {
  SnapshotHelper,
  SnapshotHelper__getReservesResult,
} from "../generated/NonfungiblePositionManager/SnapshotHelper";
import {
  Pool,
  Position,
  Token,
  User,
  UserReserveSnapshot,
  Snapshot as Snap,
} from "../generated/schema";
import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import { getCurrentTick, getReservesFromLiquidity } from "./utils";
function getPosition(event: ethereum.Event, tokenId: BigInt): Position | null {
  let position = Position.load(tokenId.toString());
  if (position === null) {
    let contract = NonfungiblePositionManager.bind(event.address);
    let positionCall = contract.try_positions(tokenId);
    if (!positionCall.reverted) {
      let positionResult = positionCall.value;
      let poolAddress = factoryContract.getPool(
        positionResult.value2,
        positionResult.value3,
        positionResult.value4
      );
      let pool = Pool.load(poolAddress.toHexString());
      if (pool) {
        position = new Position(tokenId.toString());
        // The owner gets correctly updated in the Transfer handler
        position.owner = Address.fromString(ADDRESS_ZERO);
        position.pool = poolAddress.toHexString();
        position.token0 = positionResult.value2.toHexString();
        position.token1 = positionResult.value3.toHexString();
        position.tickLower = BigInt.fromI32(positionResult.value5);
        position.tickUpper = BigInt.fromI32(positionResult.value6);
        position.liquidity = ZERO_BI;
        position.depositedToken0 = ZERO_BD;
        position.depositedToken1 = ZERO_BD;
        position.withdrawnToken0 = ZERO_BD;
        position.withdrawnToken1 = ZERO_BD;
        position.collectedToken0 = ZERO_BD;
        position.collectedToken1 = ZERO_BD;
        position.collectedFeesToken0 = ZERO_BD;
        position.collectedFeesToken1 = ZERO_BD;
        position.feeGrowthInside0LastX128 = positionResult.value8;
        position.feeGrowthInside1LastX128 = positionResult.value9;
      }
    }
  }
  return position;
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let position = getPosition(event, event.params.tokenId);

  if (position === null) {
    return;
  }

  let pool = Pool.load(position.pool);

  if (pool) {
    position.liquidity = position.liquidity.plus(event.params.liquidity);

    position.depositedToken0 = position.depositedToken0.plus(
      event.params.amount0.toBigDecimal()
    );

    position.depositedToken1 = position.depositedToken1.plus(
      event.params.amount1.toBigDecimal()
    );

    //let contract = Snapshot.bind(Address.fromString(SNAPSHOT_ADDRESS));
    position.save();

    //let snapResult = getReservesFromLiquidity(
    //  Address.fromString(position.pool),
    //  position.liquidity,
    //  event.params.tokenId
    //);
    //log.debug("After snapResult", []);
    let user = User.load(
      position.owner.toHexString() + "#" + event.params.tokenId.toString()
    );
    if (user === null) {
      user = new User(
        position.owner.toHexString() + "#" + event.params.tokenId.toString()
      );
      user.tokenId = BigInt.fromI32(0);
      user.pilotReserve = BigDecimal.fromString("0");
      user.snapshots = [];
      user.lastSnapTimestamp = BigInt.fromI32(0);
      user.lowerTick = position.tickLower;
      user.upperTick = position.tickUpper;
      user.pool = position.pool;
    }
    user.tokenId = event.params.tokenId;

    log.debug("INSIDE IF snapResult,{}", [""]);
    //let snap = new Snap(event.transaction.hash.toHexString());
    //snap.amount0 = snapResult.value0;
    //snap.amount1 = snapResult.value1;
    //snap.save();
    user.pilotReserve =
      position.token0 == PILOT_ADDRESS
        ? user.pilotReserve.plus(event.params.amount0.toBigDecimal())
        : user.pilotReserve.plus(event.params.amount1.toBigDecimal());
    user.lastSnapTimestamp = event.block.timestamp;
    if (
      event.block.timestamp
        .minus(user.lastSnapTimestamp)
        .gt(BigInt.fromI32(86400))
    ) {
      let currentTick = getCurrentTick(pool.id);
      if (currentTick.gt(user.lowerTick) && currentTick.lt(user.upperTick)) {
        let userReserveSnap = new UserReserveSnapshot(
          event.block.timestamp.toString()
        );
        userReserveSnap.block = event.block.number;
        userReserveSnap.totalPilot = user.pilotReserve;
        userReserveSnap.pilotPercentage = user.pilotReserve.times(
          BigDecimal.fromString("0.01333333333")
        );
        userReserveSnap.liquidity = position.liquidity;
        userReserveSnap.timestamp = event.block.timestamp;
        userReserveSnap.save();

        let snaps = user.snapshots;
        snaps.push(userReserveSnap.id);
        user.snapshots = snaps;
      }
    }

    user.save();
  }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let position = getPosition(event, event.params.tokenId);
  if (position == null) {
    return;
  }
  //let snapResult = getReservesFromLiquidity(
  //  Address.fromString(position.pool),
  //  position.liquidity,
  //  event.params.tokenId
  //);
  let pool = Pool.load(position.pool);
  if (pool) {
    position.liquidity = position.liquidity.minus(event.params.liquidity);

    //let snap = new Snap(event.transaction.hash.toHexString());
    //snap.amount0 = snapResult.value0;
    //snap.amount1 = snapResult.value1;
    //snap.save();
    //position.liquidity = position.liquidity.minus(event.params.liquidity);
    position.withdrawnToken0 = position.withdrawnToken0.plus(
      event.params.amount0.toBigDecimal()
    );
    position.withdrawnToken1 = position.withdrawnToken1.plus(
      event.params.amount1.toBigDecimal()
    );
    position.save();
    let user = User.load(
      position.owner.toHexString() + "#" + event.params.tokenId.toString()
    );
    user.pilotReserve =
      position.token0 == PILOT_ADDRESS
        ? user.pilotReserve.minus(event.params.amount0.toBigDecimal())
        : user.pilotReserve.minus(event.params.amount1.toBigDecimal());
    if (user.pilotReserve.lt(BigDecimal.fromString("0"))) {
      user.pilotReserve = BigDecimal.fromString("0");
    }
    if (
      event.block.timestamp
        .minus(user.lastSnapTimestamp)
        .gt(BigInt.fromI32(86400))
    ) {
      user.lastSnapTimestamp = event.block.timestamp;

      let currentTick = getCurrentTick(pool.id);
      if (currentTick.gt(user.lowerTick) && currentTick.lt(user.upperTick)) {
        let userReserveSnap = new UserReserveSnapshot(
          event.block.timestamp.toString()
        );
        userReserveSnap.block = event.block.number;
        userReserveSnap.totalPilot = user.pilotReserve;
        userReserveSnap.pilotPercentage = user.pilotReserve.times(
          BigDecimal.fromString("0.01333333333")
        );
        userReserveSnap.liquidity = position.liquidity;
        userReserveSnap.timestamp = event.block.timestamp;
        userReserveSnap.save();
        let snaps = user.snapshots;
        snaps.push(userReserveSnap.id);
        user.snapshots = snaps;
      }
    }

    user.save();
  }
}
export function handleCollect(event: Collect): void {}

export function handleTransfer(event: Transfer): void {
  let position = getPosition(event, event.params.tokenId);
  // position was not able to be fetched
  if (position == null) {
    return;
  }
  position.owner = event.params.to;
  position.save();
}
