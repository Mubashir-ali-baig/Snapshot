import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
} from "./utils/token";
import {
  Factory,
  FeeAmountEnabled,
  OwnerChanged,
  PoolCreated,
} from "../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../generated/templates";
import { Pool, Token } from "../generated/schema";
import { PILOT_ADDRESS } from "./utils/constants";

export function handleFeeAmountEnabled(event: FeeAmountEnabled): void {}

export function handleOwnerChanged(event: OwnerChanged): void {}

export function handlePoolCreated(event: PoolCreated): void {
  let token0 = Token.load(event.params.token0.toHexString());

  let token1 = Token.load(event.params.token1.toHexString());

  if (!token0) {
    token0 = new Token(event.params.token0.toHexString());
    token0.name = fetchTokenName(event.params.token0);
    token0.symbol = fetchTokenSymbol(event.params.token0);
    token0.decimals = fetchTokenDecimals(event.params.token0);
  }
  if (!token1) {
    token1 = new Token(event.params.token1.toHexString());
    token1.name = fetchTokenName(event.params.token1);
    token1.symbol = fetchTokenSymbol(event.params.token1);
    token1.decimals = fetchTokenDecimals(event.params.token1);
  }

  if (token0.id == PILOT_ADDRESS || token1.id == PILOT_ADDRESS) {
    token0.save();
    token1.save();
    let pool = new Pool(event.params.pool.toHexString());
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    
    pool.save();
    PoolTemplate.create(Address.fromString(pool.id));
  }
}
