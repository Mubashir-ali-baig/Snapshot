/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { Factory as FactoryContract } from "../../generated/templates/Pool/Factory";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x1f98431c8ad98523631ae4a59f267346ea31f984";
export const PILOT_ADDRESS = "0x37c997b35c619c21323f3518b9357914e8b99525";
export const SNAPSHOT_ADDRESS = "0x341c9717f94a99c09480d523fd501b06cae6776f";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
export let POOL_ADDR = "0xfc9f572124d8f469960b94537b493f2676776c03";
export let factoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

//0x01c722c4c7b092c2d4088c339538b01298f8cd57

// export let MONTHS_INFO:Temp = {
//   0:"31",
//   1:"28",
//   2:"31",
//   3:"30",
//   4:"31",
//   5:"30",
//   6:"31",
//   7:"31",
//   8:"30",
//   9:"31",
//   10:"30",
//   11:"31",
// }

export let MONTH_LIST: BigInt[] = [
  BigInt.fromI32(0),
  BigInt.fromI32(31),
  BigInt.fromI32(61),
  BigInt.fromI32(92),
  BigInt.fromI32(122),
  BigInt.fromI32(153),
  BigInt.fromI32(184),
  BigInt.fromI32(212),
  BigInt.fromI32(243),
  BigInt.fromI32(273),
  BigInt.fromI32(304),
  BigInt.fromI32(334),
  BigInt.fromI32(365)
];

export let GENESIS_TIMESTAMP = 1627781789 //change it manually on Aug 01 2022

export function getDays(timeRange:BigInt):BigInt{
  for(let i = 1; i<=MONTH_LIST.length;i++){
    if(timeRange.le(MONTH_LIST[i])){
      return MONTH_LIST[i].minus(MONTH_LIST[i-1])
    }
  }
  return BigInt.fromI32(30);
}