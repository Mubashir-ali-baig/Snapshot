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
  UserList,
} from "../generated/schema";
import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import { createSnapshot, getCurrentTick, getReservesFromLiquidity } from "./utils";
import { MakeTokens } from "./utils/token";

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
      if (!pool) {
        if (
          positionResult.value2.toHexString() == PILOT_ADDRESS ||
          positionResult.value3.toHexString() == PILOT_ADDRESS
        ) {
          pool = new Pool(poolAddress.toHexString());
          pool.token0 = MakeTokens(positionResult.value2);
          pool.token1 = MakeTokens(positionResult.value3);
          pool.save();
        }
      }
      if (pool) {
        position = new Position(tokenId.toString());
        // The owner gets correctly updated in the Transfer handler
        position.owner = Address.fromString(ADDRESS_ZERO);
        position.pool = poolAddress.toHexString();
        position.token0 = positionResult.value2.toHexString();
        position.token1 = positionResult.value3.toHexString();
        position.tickLower = BigInt.fromI32(positionResult.value5);
        position.tickUpper = BigInt.fromI32(positionResult.value6);
        position.tokenID = tokenId;
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
        return position;
      }
    } else {
      log.info("POSITION REVERTED,{}", [tokenId.toString()]);
      return null;
    }
  }
  return position;
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let position = getPosition(event, event.params.tokenId);

  if (position == null) {
    return;
  }

  position.liquidity = position.liquidity.plus(event.params.liquidity);

  position.depositedToken0 = position.depositedToken0.plus(
    event.params.amount0.toBigDecimal()
  );

  position.depositedToken1 = position.depositedToken1.plus(
    event.params.amount1.toBigDecimal()
  );

  position.save();

  let user = User.load(position.owner.toHexString() + "#" + position.id);
  if(user){
  user.lowerTick = position.tickLower;
  user.upperTick = position.tickUpper;
  user.userId = position.owner.toHexString()
  user.tokenId = event.params.tokenId;
  user.pool = position.pool;
  
  let snapResult = getReservesFromLiquidity(
    Address.fromString(position.pool),
    position.liquidity,
    event.params.tokenId
  );
  if (snapResult) {
    let snap = new Snap(event.transaction.hash.toHexString());
    snap.amount0 = snapResult.value0;
    snap.amount1 = snapResult.value1;
    snap.save();

    user.pilotReserve =
      position.token0 == PILOT_ADDRESS
        ? snapResult.value0.toBigDecimal()
        : snapResult.value1.toBigDecimal();
    user.save()

    let userList = UserList.load(PILOT_ADDRESS);
        if (
      event.block.timestamp.minus(userList.lastSnapTimestamp) >
      BigInt.fromI32(86400)
    ) {
      // user.lastSnapTimestamp = event.block.timestamp;
      
      let currentTick = getCurrentTick(position.pool);

      createSnapshot(currentTick,event.block.timestamp)
        // let userReserveSnap = UserReserveSnapshot.load(
        //   event.block.timestamp.toString()
        // );
        // if (!userReserveSnap) {
        //   userReserveSnap = new UserReserveSnapshot(
        //     event.block.timestamp.toString()
        //   );
        //   userReserveSnap.block = event.block.number;
        //   userReserveSnap.totalPilot = user.pilotReserve;
        //   userReserveSnap.pilotPercentage = user.pilotReserve.times(
        //     BigDecimal.fromString("0.01333333333")
        //   );
        //   userReserveSnap.liquidity = position.liquidity;
        //   userReserveSnap.timestamp = event.block.timestamp;
        //   userReserveSnap.save();
        //   let snaps = user.snapshots;
        //   snaps.push(userReserveSnap.id);
        //   user.snapshots = snaps;
        
      }
    }

    
  }
}


export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let position = getPosition(event, event.params.tokenId);
  if (position == null) {
    return;
  }

  position.liquidity = position.liquidity.minus(event.params.liquidity);
  if (position.liquidity.lt(BigInt.fromI32(0))) {
    position.liquidity = BigInt.fromI32(0);
  }

  position.withdrawnToken0 = position.withdrawnToken0.plus(
    event.params.amount0.toBigDecimal()
  );
  position.withdrawnToken1 = position.withdrawnToken1.plus(
    event.params.amount1.toBigDecimal()
  );

  position.save();

  let user = User.load(position.owner.toHexString() + "#" + position.id);

  if (user) {
    let snapResult = getReservesFromLiquidity(
      Address.fromString(position.pool),
      position.liquidity,
      event.params.tokenId
    );

    if (snapResult) {
      let snap = new Snap(event.transaction.hash.toHexString());
      snap.amount0 = snapResult.value0;
      snap.amount1 = snapResult.value1;
      snap.save();
    }

    user.pilotReserve =
      position.token0 == PILOT_ADDRESS
        ? snapResult.value0.toBigDecimal()
        : snapResult.value1.toBigDecimal();
    user.save()
    let userList = UserList.load(PILOT_ADDRESS);
    if (
      event.block.timestamp.minus(userList.lastSnapTimestamp) >
      BigInt.fromI32(86400)
    ) {
      let currentTick = getCurrentTick(position.pool);
      createSnapshot(currentTick,event.block.timestamp)
    }
    //   if (
  //     event.block.timestamp.minus(user.lastSnapTimestamp) >
  //     BigInt.fromI32(86400)
  //   ) {
  //     user.lastSnapTimestamp = event.block.timestamp;
  //     let userReserveSnap = UserReserveSnapshot.load(
  //       event.block.timestamp.toString()
  //     );
  //     let currentTick = getCurrentTick(position.pool);
  //     if (currentTick >= user.lowerTick && currentTick <= user.upperTick) {
  //       if (!userReserveSnap) {
  //         userReserveSnap = new UserReserveSnapshot(
  //           event.block.timestamp.toString()
  //         );
  //         userReserveSnap.block = event.block.number;
  //         userReserveSnap.totalPilot = user.pilotReserve;
  //         userReserveSnap.pilotPercentage = user.pilotReserve.times(
  //           BigDecimal.fromString("0.01333333333")
  //         );
  //         userReserveSnap.liquidity = position.liquidity;
  //         userReserveSnap.timestamp = event.block.timestamp;
  //         userReserveSnap.save();
  //         let snaps = user.snapshots;
  //         snaps.push(userReserveSnap.id);
  //         user.snapshots = snaps;
  //       }
  //     }
  //   }
  //   user.save();
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

  let user = User.load(position.owner.toHexString()+"#"+event.params.tokenId.toString());
  if (!user) {
    user = new User(position.owner.toHexString()+"#"+event.params.tokenId.toString());
    user.tokenId = BigInt.fromI32(0);
    user.userId = ""
    user.pilotReserve = BigDecimal.fromString("0");
    user.snapshots = [];
    user.pool = "";
    user.lowerTick = BigInt.fromI32(0);
    user.upperTick = BigInt.fromI32(0);
    user.save();

    let userList= UserList.load(PILOT_ADDRESS);
    if(!userList){
      userList = new UserList(PILOT_ADDRESS);
      userList.list=[]
      userList.lastSnapTimestamp=BigInt.fromI32(0)
    }
    let users = userList.list;
    users.push(position.owner.toHexString()+"#"+event.params.tokenId.toString());
    userList.list = users;
    userList.save()
  }
}
