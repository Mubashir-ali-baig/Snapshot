// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Pool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Pool entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Pool entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Pool", id.toString(), this);
  }

  static load(id: string): Pool | null {
    return store.get("Pool", id) as Pool | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token0(): string {
    let value = this.get("token0");
    return value.toString();
  }

  set token0(value: string) {
    this.set("token0", Value.fromString(value));
  }

  get token1(): string {
    let value = this.get("token1");
    return value.toString();
  }

  set token1(value: string) {
    this.set("token1", Value.fromString(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }
}

export class Snapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Snapshot entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Snapshot entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Snapshot", id.toString(), this);
  }

  static load(id: string): Snapshot | null {
    return store.get("Snapshot", id) as Snapshot | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get amount0(): BigInt {
    let value = this.get("amount0");
    return value.toBigInt();
  }

  set amount0(value: BigInt) {
    this.set("amount0", Value.fromBigInt(value));
  }

  get amount1(): BigInt {
    let value = this.get("amount1");
    return value.toBigInt();
  }

  set amount1(value: BigInt) {
    this.set("amount1", Value.fromBigInt(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get pool(): string {
    let value = this.get("pool");
    return value.toString();
  }

  set pool(value: string) {
    this.set("pool", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get userId(): string {
    let value = this.get("userId");
    return value.toString();
  }

  set userId(value: string) {
    this.set("userId", Value.fromString(value));
  }

  get pilotReserve(): BigDecimal {
    let value = this.get("pilotReserve");
    return value.toBigDecimal();
  }

  set pilotReserve(value: BigDecimal) {
    this.set("pilotReserve", Value.fromBigDecimal(value));
  }

  get otherToken(): BigDecimal {
    let value = this.get("otherToken");
    return value.toBigDecimal();
  }

  set otherToken(value: BigDecimal) {
    this.set("otherToken", Value.fromBigDecimal(value));
  }

  get liquidity(): BigInt {
    let value = this.get("liquidity");
    return value.toBigInt();
  }

  set liquidity(value: BigInt) {
    this.set("liquidity", Value.fromBigInt(value));
  }

  get snapshots(): Array<string> {
    let value = this.get("snapshots");
    return value.toStringArray();
  }

  set snapshots(value: Array<string>) {
    this.set("snapshots", Value.fromStringArray(value));
  }

  get lowerTick(): BigInt {
    let value = this.get("lowerTick");
    return value.toBigInt();
  }

  set lowerTick(value: BigInt) {
    this.set("lowerTick", Value.fromBigInt(value));
  }

  get upperTick(): BigInt {
    let value = this.get("upperTick");
    return value.toBigInt();
  }

  set upperTick(value: BigInt) {
    this.set("upperTick", Value.fromBigInt(value));
  }

  get updateTimestamp(): BigInt {
    let value = this.get("updateTimestamp");
    return value.toBigInt();
  }

  set updateTimestamp(value: BigInt) {
    this.set("updateTimestamp", Value.fromBigInt(value));
  }

  get eligible(): boolean {
    let value = this.get("eligible");
    return value.toBoolean();
  }

  set eligible(value: boolean) {
    this.set("eligible", Value.fromBoolean(value));
  }
}

export class UserList extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save UserList entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save UserList entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("UserList", id.toString(), this);
  }

  static load(id: string): UserList | null {
    return store.get("UserList", id) as UserList | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get list(): Array<string> {
    let value = this.get("list");
    return value.toStringArray();
  }

  set list(value: Array<string>) {
    this.set("list", Value.fromStringArray(value));
  }

  get lastSnapTimestamp(): BigInt {
    let value = this.get("lastSnapTimestamp");
    return value.toBigInt();
  }

  set lastSnapTimestamp(value: BigInt) {
    this.set("lastSnapTimestamp", Value.fromBigInt(value));
  }
}

export class UserReserveSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save UserReserveSnapshot entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save UserReserveSnapshot entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("UserReserveSnapshot", id.toString(), this);
  }

  static load(id: string): UserReserveSnapshot | null {
    return store.get("UserReserveSnapshot", id) as UserReserveSnapshot | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalPilot(): BigDecimal {
    let value = this.get("totalPilot");
    return value.toBigDecimal();
  }

  set totalPilot(value: BigDecimal) {
    this.set("totalPilot", Value.fromBigDecimal(value));
  }

  get pilotPercentage(): BigDecimal {
    let value = this.get("pilotPercentage");
    return value.toBigDecimal();
  }

  set pilotPercentage(value: BigDecimal) {
    this.set("pilotPercentage", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class RangeStatus extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save RangeStatus entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save RangeStatus entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("RangeStatus", id.toString(), this);
  }

  static load(id: string): RangeStatus | null {
    return store.get("RangeStatus", id) as RangeStatus | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get outOfRange(): boolean {
    let value = this.get("outOfRange");
    return value.toBoolean();
  }

  set outOfRange(value: boolean) {
    this.set("outOfRange", Value.fromBoolean(value));
  }
}

export class Position extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Position entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Position entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Position", id.toString(), this);
  }

  static load(id: string): Position | null {
    return store.get("Position", id) as Position | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get pool(): string {
    let value = this.get("pool");
    return value.toString();
  }

  set pool(value: string) {
    this.set("pool", Value.fromString(value));
  }

  get tokenID(): BigInt {
    let value = this.get("tokenID");
    return value.toBigInt();
  }

  set tokenID(value: BigInt) {
    this.set("tokenID", Value.fromBigInt(value));
  }

  get token0(): string {
    let value = this.get("token0");
    return value.toString();
  }

  set token0(value: string) {
    this.set("token0", Value.fromString(value));
  }

  get token1(): string {
    let value = this.get("token1");
    return value.toString();
  }

  set token1(value: string) {
    this.set("token1", Value.fromString(value));
  }

  get tickLower(): BigInt {
    let value = this.get("tickLower");
    return value.toBigInt();
  }

  set tickLower(value: BigInt) {
    this.set("tickLower", Value.fromBigInt(value));
  }

  get tickUpper(): BigInt {
    let value = this.get("tickUpper");
    return value.toBigInt();
  }

  set tickUpper(value: BigInt) {
    this.set("tickUpper", Value.fromBigInt(value));
  }

  get liquidity(): BigInt {
    let value = this.get("liquidity");
    return value.toBigInt();
  }

  set liquidity(value: BigInt) {
    this.set("liquidity", Value.fromBigInt(value));
  }

  get depositedToken0(): BigDecimal {
    let value = this.get("depositedToken0");
    return value.toBigDecimal();
  }

  set depositedToken0(value: BigDecimal) {
    this.set("depositedToken0", Value.fromBigDecimal(value));
  }

  get depositedToken1(): BigDecimal {
    let value = this.get("depositedToken1");
    return value.toBigDecimal();
  }

  set depositedToken1(value: BigDecimal) {
    this.set("depositedToken1", Value.fromBigDecimal(value));
  }

  get withdrawnToken0(): BigDecimal {
    let value = this.get("withdrawnToken0");
    return value.toBigDecimal();
  }

  set withdrawnToken0(value: BigDecimal) {
    this.set("withdrawnToken0", Value.fromBigDecimal(value));
  }

  get withdrawnToken1(): BigDecimal {
    let value = this.get("withdrawnToken1");
    return value.toBigDecimal();
  }

  set withdrawnToken1(value: BigDecimal) {
    this.set("withdrawnToken1", Value.fromBigDecimal(value));
  }

  get collectedToken0(): BigDecimal {
    let value = this.get("collectedToken0");
    return value.toBigDecimal();
  }

  set collectedToken0(value: BigDecimal) {
    this.set("collectedToken0", Value.fromBigDecimal(value));
  }

  get collectedToken1(): BigDecimal {
    let value = this.get("collectedToken1");
    return value.toBigDecimal();
  }

  set collectedToken1(value: BigDecimal) {
    this.set("collectedToken1", Value.fromBigDecimal(value));
  }

  get collectedFeesToken0(): BigDecimal {
    let value = this.get("collectedFeesToken0");
    return value.toBigDecimal();
  }

  set collectedFeesToken0(value: BigDecimal) {
    this.set("collectedFeesToken0", Value.fromBigDecimal(value));
  }

  get collectedFeesToken1(): BigDecimal {
    let value = this.get("collectedFeesToken1");
    return value.toBigDecimal();
  }

  set collectedFeesToken1(value: BigDecimal) {
    this.set("collectedFeesToken1", Value.fromBigDecimal(value));
  }

  get feeGrowthInside0LastX128(): BigInt {
    let value = this.get("feeGrowthInside0LastX128");
    return value.toBigInt();
  }

  set feeGrowthInside0LastX128(value: BigInt) {
    this.set("feeGrowthInside0LastX128", Value.fromBigInt(value));
  }

  get feeGrowthInside1LastX128(): BigInt {
    let value = this.get("feeGrowthInside1LastX128");
    return value.toBigInt();
  }

  set feeGrowthInside1LastX128(value: BigInt) {
    this.set("feeGrowthInside1LastX128", Value.fromBigInt(value));
  }
}
