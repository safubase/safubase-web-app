// MODULES
import Web3 from 'web3';

// CONFIG
import config from '../config';

/*
 * UTILS
 * Allmost none of the utility functions changes the global context. Keep the context update as minimum as possible for unintended results.
 *
 */
export async function sleep(ms = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/*
 *
 * STRING FUNCTIONS
 *
 */
export async function str_copy(str) {
  try {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(str);
    } else {
      document.execCommand('copy', true, str);
    }
  } catch (err) {}
}

export function str_remove_extra_space(str, mode = 0) {
  if (!str || typeof str !== 'string') {
    return null;
  }

  if (typeof mode === 'number') {
    throw new Error('Invalid mode argument provided in remove_extra_space');
  }

  if (mode === 0) {
    let new_str = '';

    for (let i = 0; i < str.length; i++) {
      const current = str[i];
      const next = str[i + 1];

      if (current === ' ') {
        if (next && next !== ' ') {
          if (new_str.length) {
            new_str = new_str + current;
          }
        }
      } else {
        new_str = new_str + current;
      }
    }

    return new_str;
  }

  if (mode === 1) {
    return str.replace(/\s/g, ' ');
  }

  return '';
}

export function str_reduce(str, offset = 14) {
  let result = '';

  if (str.length > offset) {
    for (let i = 0; i < offset; i++) {
      result = result + str[i];
    }

    return result;
  }

  return str;
}

/*
 *
 * NUMBER FUNCTIONS
 *
 */

export function num_add_commas(num) {
  if (
    !num &&
    typeof num !== config.types.number &&
    typeof num !== config.types.string
  ) {
    return null;
  }

  num = num.toString();
  let new_num = '';
  let ctr = 0;
  let start = false;

  if (num.includes('.')) {
    for (let i = num.length - 1; i > -1; i--) {
      if (num[i + 1] === '.') {
        start = true;
      }

      if (start) {
        if (ctr && ctr % 3 === 0) {
          new_num = num[i] + ',' + new_num;
        } else {
          new_num = num[i] + new_num;
        }

        ctr++;
      } else {
        new_num = num[i] + new_num;
      }
    }
  } else {
    for (let i = num.length - 1; i > -1; i--) {
      if (ctr && ctr % 3 === 0) {
        new_num = num[i] + ',' + new_num;
      } else {
        new_num = num[i] + new_num;
      }

      ctr++;
    }
  }

  return new_num;
}

export function num_shorten(num) {
  if (num === 0) {
    return 0;
  }

  if (
    num === null ||
    !Number(num) ||
    (typeof num !== 'string' && typeof num !== 'number')
  ) {
    return null;
  }

  num = parseInt(num).toString();

  let ctr = 0;
  let new_num = '';
  let symbol = '';

  if (num.length > 12) {
    symbol = 'T';

    for (let i = num.length - 1; i > -1; i--) {
      ctr++;

      if (ctr > 12) {
        new_num = num[i] + new_num;
      }
    }

    return new_num + symbol;
  }

  if (num.length > 9) {
    symbol = 'B';

    for (let i = num.length - 1; i > -1; i--) {
      ctr++;

      if (ctr > 9) {
        new_num = num[i] + new_num;
      }
    }

    return new_num + symbol;
  }

  if (num.length > 6) {
    symbol = 'M';

    for (let i = num.length - 1; i > -1; i--) {
      ctr++;

      if (ctr > 6) {
        new_num = num[i] + new_num;
      }
    }

    return new_num + symbol;
  }

  if (num.length > 3) {
    symbol = 'K';

    for (let i = num.length - 1; i > -1; i--) {
      ctr++;

      if (ctr > 3) {
        new_num = num[i] + new_num;
      }
    }

    return new_num + symbol;
  }
}

/**
 *
 * WALLET FUNCTIONS
 *
 *
 */
export async function wallet_req_accounts() {
  if (!window.ethereum) {
    return null;
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

  if (!accounts) {
    return null;
  }

  if (!accounts[0]) {
    return null;
  }

  return accounts;
}

export async function wallet_connect({ chain_id = 56 }) {
  if (!window.ethereum) {
    return null;
  }

  const chains = {
    // Ethereum Mainnet
    1: {
      chainId: Web3.utils.toHex(1),
      chainName: 'ETHW-mainnet',
      rpcUrls: ['https://mainnet.ethereumpow.org'],
      blockExplorerUrls: ['https://mainnet.ethwscan.com'],
    },
    // Binance Smart Chain Mainnet
    56: {
      chainId: Web3.utils.toHex(56),
      chainName: 'Smart Chain',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  };

  let accounts = null;

  try {
    accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(chain_id) }],
    });

    accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
  } catch (err) {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chains[chain_id]],
    });

    accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
  }

  return accounts;
}

export async function wallet_add_listeners(context) {
  // WALLET EVENTS
  if (!window.ethereum) {
    return null;
  }

  ethereum.on('accountsChanged', (accounts) => {
    if (!accounts || !accounts.length) {
      context.set_state({
        ...context.state,
        wallet_address: null,
      });

      return;
    }

    context.set_state({
      ...context.state,
      wallet_address: accounts[0],
    });
  });
}

export default {
  sleep,
  str_copy,
  str_remove_extra_space,
  str_reduce,
  num_add_commas,
  num_shorten,
  wallet_req_accounts,
  wallet_connect,
  wallet_add_listeners,
};
