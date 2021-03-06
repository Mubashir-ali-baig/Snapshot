/* eslint-disable prefer-const */
import {
  BigInt,
  BigDecimal,
  ethereum,
  Address,
  log,
} from "@graphprotocol/graph-ts";
import {
  SnapshotHelper,
  SnapshotHelper__getReservesResult,
} from "../../generated/NonfungiblePositionManager/SnapshotHelper";

import { Pool as PoolInstance } from "../../generated/NonfungiblePositionManager/Pool";
//import { Transaction } from "../types/schema";
import {
  ONE_BI,
  ZERO_BI,
  ZERO_BD,
  ONE_BD,
  SNAPSHOT_ADDRESS,
  PILOT_ADDRESS,
  POOL_ADDR,
  
  MONTH_LIST,
  GENESIS_TIMESTAMP,
  getDays,
} from "../utils/constants";
import {
  RangeStatus,
  User,
  UserList,
  UserReserveSnapshot,
  Snapshot as Snap,
} from "../../generated/schema";

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

// return 0 if denominator is 0 in division
export function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD;
  } else {
    return amount0.div(amount1);
  }
}

export function bigDecimalExponated(
  value: BigDecimal,
  power: BigInt
): BigDecimal {
  if (power.equals(ZERO_BI)) {
    return ONE_BD;
  }
  let negativePower = power.lt(ZERO_BI);
  let result = ZERO_BD.plus(value);
  let powerAbs = power.abs();
  for (let i = ONE_BI; i.lt(powerAbs); i = i.plus(ONE_BI)) {
    result = result.times(value);
  }

  if (negativePower) {
    result = safeDiv(ONE_BD, result);
  }

  return result;
}

export function tokenAmountToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function priceToDecimal(
  amount: BigDecimal,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return amount;
  }
  return safeDiv(amount, exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(ZERO_BD.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(18));
}

export function getReservesFromLiquidity(
  pool: Address,
  liquidity: BigInt,
  tokenId: BigInt
): SnapshotHelper__getReservesResult | null {
  let snap = SnapshotHelper.bind(
    Address.fromString("0x341c9717f94a99c09480d523fd501b06cae6776f")
  );
  let snapCall = snap.try_getReserves(pool, liquidity, tokenId);
  log.info("HERE IN INDEX,{},{},{}", [
    liquidity.toString(),
    tokenId.toString(),
    pool.toHexString(),
  ]);

  if (!snapCall.reverted) {
    log.info("HERE IN INDEX IF,{}", [""]);
    return snapCall.value;
  } else {
    snapCall = snap.try_getReserves(pool, liquidity, tokenId);
    log.info("HERE IN INDEX ELSE,{},{},{}", [
      liquidity.toString(),
      tokenId.toString(),
      pool.toHexString(),
    ]);
    if (!snapCall.reverted) {
      log.info("HERE IN INDEX E,{}", [""]);
      return snapCall.value;
    }
  }

  return null;
}

//export function isInRange(amount0: BigInt, amount1: BigInt): Boolean {
//  if (amount0.gt(BigInt.fromI32(0)) && amount1.gt(BigInt.fromI32(0))) {
//    return true;
//  }
//  return false;
//}
export function getCurrentTick(poolAddress: string): BigInt {
  let pool = PoolInstance.bind(Address.fromString(poolAddress));
  if (pool) {
    let slotCall = pool.try_slot0();
    if (!slotCall.reverted) {
      let slotResult = slotCall.value;
      let tick = BigInt.fromI32(slotResult.value1);
      log.info("HERE,{}", [tick.toString()]);
      return tick;
    }
  }
  return BigInt.fromI32(0);
}

export function createSnapshot(currentTimestamp: BigInt): void {
  let userList = UserList.load(PILOT_ADDRESS);
  if (userList) {
    if (
      currentTimestamp.minus(userList.lastSnapTimestamp) > BigInt.fromI32(86400)
    ) {
      let list = userList.list;
      let listSize = list.length;
      for (let i = 0; i < listSize; i++) {
        let user = User.load(list[i]);
        if (!user || !user.eligible) {
          log.info("NOT USER,{}", [""]);
          continue;
        }
        if (user.pool == POOL_ADDR) {
          let currentTick = getCurrentTick(user.pool);
          if (
            currentTick.ge(user.lowerTick) &&
            currentTick.le(user.upperTick)
          ) {
            if (user.liquidity.gt(ZERO_BI) && user.pilotReserve == ZERO_BD) {
              let snapResult = getReservesFromLiquidity(
                Address.fromString(user.pool),
                user.liquidity,
                user.tokenId
              );
              if (snapResult) {
                if (user.pool == POOL_ADDR) {
                  user.pilotReserve = snapResult.value0.toBigDecimal();
                  user.otherToken = snapResult.value1.toBigDecimal();
                  user.updateTimestamp = currentTimestamp;
                  user.save();
                }
              }
            }
            let snapList = user.snapshots;

            let snapId = user.id + "#" + currentTimestamp.toString();
            let snap = new UserReserveSnapshot(snapId);
            snap.totalPilot = user.pilotReserve;
         
            let timeRange = currentTimestamp.minus(BigInt.fromI32(GENESIS_TIMESTAMP)).div(BigInt.fromI32(86400))
            let days = getDays(timeRange);
            snap.pilotPercentage = snap.totalPilot.times(
              BigDecimal.fromString("0.4").div(BigDecimal.fromString(days.toString()))
            );

            snap.timestamp = currentTimestamp;
            snap.save();
            snapList.push(snap.id);

            user.snapshots = snapList;
            user.save();
          } else {
            let snapList = user.snapshots;
            let snapId = user.id + "#" + currentTimestamp.toString();
            let snap = new UserReserveSnapshot(snapId);
            snap.totalPilot = BigDecimal.fromString("0");
            snap.pilotPercentage = BigDecimal.fromString("0");
            snap.timestamp = currentTimestamp;
            snap.save();
            snapList.push(snap.id);
            user.snapshots = snapList;
            user.save();
          }

          userList.lastSnapTimestamp = currentTimestamp;
          userList.save();
        }
      }
    }
  }
}

export function updateRangeStatus(currentTimestamp: BigInt): void {
  let userList = UserList.load(PILOT_ADDRESS);
  if (userList) {
    let list = userList.list;
    let listSize = list.length;
    for (let i = 0; i < listSize; i++) {
      let user = User.load(list[i]);
      if (!user) {
        log.info("NOT USER,{}", [""]);
        continue;
      }
      if (user.pool == POOL_ADDR) {
        let rangeStatus = new RangeStatus(
          user.id + "#" + currentTimestamp.toString()
        );
        let currentTick = getCurrentTick(user.pool);

        if (currentTick.ge(user.lowerTick) && currentTick.le(user.upperTick)) {
          rangeStatus.outOfRange = false;
        } else {
          rangeStatus.outOfRange = true;
          let snapList = user.snapshots;
          if (snapList.length > 0) {
            let snapValue = UserReserveSnapshot.load(
              snapList[snapList.length - 1]
            );
            if (
              currentTimestamp
                .minus(snapValue.timestamp)
                .gt(BigInt.fromI32(86400))
            ) {
              let snapId = user.id + "#" + currentTimestamp.toString();
              let snap = new UserReserveSnapshot(snapId);
              snap.totalPilot = BigDecimal.fromString("0");
              snap.pilotPercentage = BigDecimal.fromString("0");
              snap.timestamp = currentTimestamp;
              snap.save();
              snapList.push(snap.id);
              user.snapshots = snapList;
              user.save();
            }
          }
        }
        rangeStatus.save();
      }
    }
  }
}
