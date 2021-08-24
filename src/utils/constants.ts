/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { Factory as FactoryContract } from "../../generated/templates/Pool/Factory";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x1f98431c8ad98523631ae4a59f267346ea31f984";
export const PILOT_ADDRESS = "0x37c997b35c619c21323f3518b9357914e8b99525"; //rinkeby
export const SNAPSHOT_ADDRESS = "0x1bDc812F518726eFc12E271261848104501784AF"; //"0x341c9717f94a99c09480d523fd501b06cae6776f" mainnet;

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let factoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

//0x01c722c4c7b092c2d4088c339538b01298f8cd57
