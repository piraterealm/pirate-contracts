import dotenv from 'dotenv';
import productionAddress from './metadata/production.address.json';
import testnetAddress from './metadata/testnet.address.json';
import uetAddress from './metadata/uet.address.json';

dotenv.config();

export function getKey(): string {
  const environment = process.env.ENV_NODE!;
  switch (environment) {
    case 'production': {
      return process.env.SECRET_KEY_PRODUCTION!;
    }
    case 'uet': {
      return process.env.SECRET_KEY_UET!;
    }
    case 'testnet': {
      return process.env.SECRET_KEY_TESTNET!;
    }
  }
  return process.env.SECRET_KEY_TESTNET!;
}

export function getUpdaterKey(): string {
  const environment = process.env.ENV_NODE!;
  switch (environment) {
    case 'production': { return process.env.UPDATER_PRODUCTION!; }
    case 'uet': { return process.env.UPDATER_UET!; }
    case 'testnet': { return process.env.UPDATER_TESTNET!; }
  }
  return process.env.UPDATER_TESTNET!;
}

export function getCreator(): string {
  const environment = process.env.ENV_NODE!;
  switch (environment) {
    case 'production': {
      return process.env.CREATOR_PRODUCTION!;
    }
    case 'uet': {
      return process.env.CREATOR_UET!;
    }
    case 'testnet': {
      return process.env.CREATOR_TESTNET!;
    }
  }
  return process.env.SECRET_KEY_TESTNET!;
}

export function getNetwork(): string {
  const environment = process.env.ENV_NODE!;
  switch (environment) {
    case 'production': {
      return process.env.RPC_MAINNET!;
    }
    case 'uet': {
      return process.env.RPC_MAINNET!;
    }
    case 'testnet': {
      return process.env.RPC_TESTNET!;
    }
  }
  return process.env.RPC_TESTNET!;
}

export function getAddress(): any {
  const environment = process.env.ENV_NODE!;
  switch (environment) {
    case 'production': {
      return productionAddress;
    }
    case 'uet': {
      return uetAddress;
    }
    case 'testnet': {
      return testnetAddress;
    }
  }
}
