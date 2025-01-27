// MODULES
import React from 'react';
import axios from 'axios';
import cn from 'classnames';

// COMPONENTS
import Head from '../components/head';
import Layout_user from '../components/layouts/user';
import Modal_presale from '../components/modals/presale';

// COMPONENTS > ICONS (SVGS)
import Icon_search from '../components/icons/search';
import Icon_arrow from '../components/icons/arrow';
import Icon_loading from '../components/icons/loading';
import Icon_info from '../components/icons/info';
import Icon_lock from '../components/icons/lock';

// CONTEXT
import { Context } from '../context';

// UTILS
import UTILS from '../utils/index.js';
import UTILS_API from '../utils/api.js';

// STYLES
import style from '../styles/pages/home.module.css';

/**
 *
 * GLOBAL FUNCTIONS, for both serverside and components
 *
 */
function global_sort_audits_by_date(data) {
  // order from newly created
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j + 1]) {
        const current = data[j];
        const next = data[j + 1];

        if (
          new Date(current.created_at).valueOf() <
          new Date(next.created_at).valueOf()
        ) {
          data[j] = next;
          data[j + 1] = current;
        }
      }
    }
  }

  return data;
}

/**
 *
 * SERVER SIDE data processing layer, But it is better to do the math calculations in client side.
 *
 */
export async function getServerSideProps({ req }) {
  const props = {
    audits: [],
  };

  const api_res_get_audits = await UTILS_API.blockchain_get_audits(1);

  if (api_res_get_audits.code) {
    return {
      props: props,
    };
  }

  global_sort_audits_by_date(api_res_get_audits.data);

  // humanize created at value
  for (let i = 0; i < api_res_get_audits.data.length; i++) {
    api_res_get_audits.data[i].created_at = new Date(
      api_res_get_audits.data[i].created_at
    )
      .toISOString()
      .split('T')[0];
  }

  props.audits = api_res_get_audits.data;

  return {
    props: props,
  };
}

/**
 *
 *
 * HOME PAGE COMPONENTS ***************
 *
 */

/**
 *
 * HELLO COMPONENT
 *
 */
class Comp_hello extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={cn(style['comphello'])}>
        <div className={cn(style['comphello-textarea'])}>
          <div className={cn(style['comphello-textarea-title'])}>
            Hello{' '}
            {this.context.state.auth
              ? this.context.state.user.username + '!'
              : null}
          </div>
          <span className={cn(style['comphello-textarea-desc'])}>
            {this.context.state.auth
              ? "It's good to see you again."
              : "It's good to see you."}
          </span>
        </div>

        <img
          className={cn(style['comphello-manimg'])}
          src="/images/man.png"
          alt="man"
          title="Man"
        />
      </div>
    );
  }
}

/**
 *
 *
 * INPUT COMPONENT
 *
 */
class Comp_input extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      dd_open: false, // dropdown open
      modal_open: false,
      bar_pct: 0, // bar percentage
      bar_info: 'analyzing token credentials',
      address: '',
      network: {
        img: '/bnb_chain.png',
        name: 'BNB Chain',
        chain_id: 56,
      }, // default selected network
      networks: [
        {
          img: '/bnb_chain.png',
          name: 'BNB Chain',
          chain_id: 56,
        },
        {
          img: '/eth.png',
          name: 'Ethereum',
          chain_id: 1,
        },
        {
          img: '/polygon.png',
          name: 'Polygon',
          chain_id: 137,
        },
        {
          img: 'https://cdn.discordapp.com/attachments/992423326301565029/1108455307715280896/avax-network.png',
          name: 'Avax',
          chain_id: 43114,
        },
      ],
      loading: false,
    };

    this.bar_ref = React.createRef();

    this.modal_init = this.modal_init.bind(this);
  }

  async modal_init() {
    if (this.state.loading) {
      return;
    }

    if (!this.state.address) {
      this.context.set_state({
        ...this.context.state,
        ui_toasts: [
          ...this.context.state.ui_toasts,
          {
            type: 'error',
            message: 'Address is empty',
            created_at: new Date(),
          },
        ],
      });

      return;
    }

    this.setState({
      ...this.state,
      network: { ...this.state.network },
      networks: [...this.state.networks],
      loading: true,
    });

    const api_res_blockchain_audit = await UTILS_API.blockchain_audit(1, {
      address: this.state.address.toLowerCase(),
      chain_id: this.state.network.chain_id,
    });

    if (api_res_blockchain_audit.code) {
      this.setState({
        ...this.state,
        network: { ...this.state.network },
        networks: [...this.state.networks],
        loading: false,
      });

      this.context.set_state({
        ...this.context.state,
        ui_toasts: [
          ...this.context.state.ui_toasts,
          {
            type: 'error',
            message: api_res_blockchain_audit.message,
            created_at: new Date(),
          },
        ],
      });

      return;
    }

    const bar_div = this.bar_ref.current;

    if (!bar_div) {
      return null;
    }

    let total_pct = 0;
    const repeat_len = 4;
    const random_pct_padding = Math.floor(Math.random() * 13 + 5);
    const token_info_index = [
      'analyzing token credentials',
      'checking security measures',
      'detailizing safu information',
      'finalizing results for you...',
    ];

    for (let i = 0; i < repeat_len; i++) {
      const random_pct = Math.floor(Math.random() * 34 + random_pct_padding);

      total_pct = total_pct + random_pct;

      if (total_pct >= 100 || i === repeat_len - 1) {
        total_pct = 99.9;
      }

      this.setState({
        ...this.state,
        modal_open: true,
        network: { ...this.state.network },
        networks: [...this.state.networks],
        loading: false,
        bar_pct: total_pct,
        bar_info: token_info_index[i],
      });

      let delay_ms = Math.floor(Math.random() * 1000 + 700);

      bar_div.style.width = total_pct + '%';

      await UTILS.sleep(delay_ms);
    }

    // Modal progress bar done...
    window.location.replace(
      'https://app.safubase.com/audits/' +
        this.state.address +
        '?chain_id=' +
        this.state.network.chain_id
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compinput'])}>
        <div className={cn(style['compinput-left'])}>
          <div className={cn(style['compinput-left-logo'])}>LIVE</div>
          You can quickly check the
          <strong> token smart contract</strong> here. This is a quick Audit
          option.
        </div>

        <div className={cn(style['compinput-right'])}>
          <div className={cn(style['compinput-right-bg'])}>
            <div className={cn(style['compinput-right-bg-inputarea'])}>
              <div
                onClick={() => {
                  this.setState({
                    ...this.state,
                    dd_open: !this.state.dd_open,
                  });
                }}
                className={cn(style['compinput-right-bg-inputarea-dd'])}
              >
                <img src={this.state.network.img} />
              </div>

              <div
                className={cn(
                  style['compinput-right-bg-inputarea-ddoptions'],
                  this.state.dd_open
                    ? style['compinput-right-bg-inputarea-ddoptionsopen']
                    : null
                )}
              >
                {this.state.networks.map((curr, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        this.setState({
                          ...this.state,
                          network: curr,
                          dd_open: false,
                        });
                      }}
                      className={cn(
                        style['compinput-right-bg-inputarea-ddoptions-item']
                      )}
                    >
                      <img
                        className={cn(
                          style[
                            'compinput-right-bg-inputarea-ddoptions-item-img'
                          ]
                        )}
                        src={curr.img}
                      />

                      <div
                        className={cn(
                          style[
                            'compinput-right-bg-inputarea-ddoptions-item-name'
                          ]
                        )}
                      >
                        {curr.name}
                      </div>

                      <input
                        className={cn(
                          style[
                            'compinput-right-bg-inputarea-ddoptions-item-check'
                          ]
                        )}
                        type="checkbox"
                        checked={this.state.network.name === curr.name}
                        onChange={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <input
                className={cn(style['compinput-right-bg-inputarea-input'])}
                placeholder="0x90741BD5C2c928Ad19a58157987e11b2dE07c15B"
                value={this.state.address}
                onChange={(e) => {
                  this.setState({ ...this.state, address: e.target.value });
                }}
              ></input>
            </div>

            <button
              onClick={this.modal_init}
              className={cn(
                style['compinput-right-bg-btn'],
                this.state.loading
                  ? style['compinput-right-bg-btnloading']
                  : null
              )}
            >
              {this.state.loading ? <Icon_loading /> : 'AUDIT'}
            </button>
          </div>
        </div>

        <div
          className={cn(
            style['compinput-modal'],
            this.state.modal_open ? style['compinput-modalopen'] : null
          )}
        >
          <div className={cn(style['compinput-modal-content'])}>
            <div className={cn(style['compinput-modal-content-info'])}>
              {this.state.bar_info}
            </div>

            <div
              className={cn(style['compinput-modal-content-progressbarctr'])}
            >
              <div
                className={cn(
                  style['compinput-modal-content-progressbarctr-status']
                )}
              >
                {this.state.bar_pct}% Loading...
              </div>
              <div
                ref={this.bar_ref}
                className={cn(
                  style['compinput-modal-content-progressbarctr-bar']
                )}
              >
                <div
                  className={cn(
                    style[
                      'compinput-modal-content-progressbarctr-bar-reflection'
                    ]
                  )}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 *
 * LATEST AUDITS COMPONENT
 *
 */
class Comp_last_adts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'all',
      audits: props.data,
      animation: false,
      chain_id: '',
    };

    this.audits_ref = React.createRef();

    this.animate = this.animate.bind(this);
    this.api_get_audits = this.api_get_audits.bind(this);
  }

  animate() {
    if (!this.state.animation) {
      return;
    }

    this.audits_ref.current.children[0].classList.add(
      style['complastadts-audits-itemani']
    );

    // Remove animation class after 1 seconds to clean the state
    setTimeout(() => {
      let ani_class = '';

      const class_list = this.audits_ref.current.children[0].classList;

      for (let i = 0; i < class_list.length; i++) {
        if (class_list[i].includes('complastadts-audits-itemani')) {
          // include param must be included in the class name in css
          ani_class = class_list[i];
        }
      }

      if (!ani_class) {
        return;
      }

      class_list.remove(ani_class);

      this.setState({
        ...this.state,
        animation: false,
      });
    }, 1000);
  }

  // Fetch latest audits once in a while
  async api_get_audits() {
    setInterval(async () => {
      const api_res_audits = await UTILS_API.blockchain_get_audits(1);

      if (api_res_audits.code) {
        return;
      }

      global_sort_audits_by_date(api_res_audits.data);

      // humanize created at value
      for (let i = 0; i < api_res_audits.data.length; i++) {
        api_res_audits.data[i].created_at = new Date(
          api_res_audits.data[i].created_at
        )
          .toISOString()
          .split('T')[0];
      }

      if (
        api_res_audits.data[0].address.toLowerCase() ===
        this.state.audits[0].address.toLowerCase()
      ) {
        this.setState({
          ...this.state,
          audits: api_res_audits.data,
          animation: false,
        });

        return;
      }

      this.setState({
        ...this.state,
        audits: api_res_audits.data,
        animation: true,
      });
    }, 10000);
  }

  // Fetches new data in intervals and updates state
  componentDidMount() {
    this.api_get_audits();
  }

  // Adds animation style to the first latest audit bar after every update
  componentDidUpdate() {
    this.animate();
  }

  render() {
    return (
      <div id="complastadts" className={cn(style['complastadts'])}>
        <div className={cn(style['comlastadts-title'])}>LATEST AUDITS</div>

        <div className={cn(style['complastadts-cats'])}>
          <div
            onClick={() => {
              this.setState({ ...this.state, chain_id: '' });
            }}
            className={cn(
              style['complastadts-cats-item'],
              this.state.chain_id === ''
                ? style['complastadts-cats-itemactive']
                : null
            )}
          >
            All Audits
          </div>

          <div
            onClick={() => {
              this.setState({ ...this.state, chain_id: '56' });
            }}
            className={cn(
              style['complastadts-cats-item'],
              this.state.chain_id === '56'
                ? style['complastadts-cats-itemactive']
                : null
            )}
          >
            Binance Smart Chain
          </div>

          <div
            onClick={() => {
              this.setState({ ...this.state, chain_id: '1' });
            }}
            className={cn(
              style['complastadts-cats-item'],
              this.state.chain_id === '1'
                ? style['complastadts-cats-itemactive']
                : null
            )}
          >
            Ethereum
          </div>

          <div
            onClick={() => {
              this.setState({ ...this.state, chain_id: '137' });
            }}
            className={cn(
              style['complastadts-cats-item'],
              this.state.chain_id === '137'
                ? style['complastadts-cats-itemactive']
                : null
            )}
          >
            Polygon
          </div>

          <div
            onClick={() => {
              this.setState({ ...this.state, chain_id: '1399811149' });
            }}
            className={cn(
              style['complastadts-cats-item'],
              this.state.chain_id === '1399811149'
                ? style['complastadts-cats-itemactive']
                : null
            )}
          >
            Solana
          </div>
        </div>

        <div ref={this.audits_ref} className={cn(style['complastadts-audits'])}>
          {this.state.audits.map((curr, index) => {
            if (
              this.state.chain_id === '' ||
              curr.chain_id.toString() === this.state.chain_id.toString()
            ) {
              return (
                <div
                  key={index}
                  className={cn(
                    style['complastadts-audits-item'],
                    index % 2 === 0
                      ? style['complastadts-audits-itemwhitebg']
                      : null
                  )}
                >
                  <div
                    className={cn(
                      style['complastadts-audits-item-imgnamesymbol']
                    )}
                  >
                    <div
                      className={cn(
                        style['complastadts-audits-item-imgnamesymbol-img']
                      )}
                    >
                      <img
                        src={
                          (curr.chain_id.toString() === '1'
                            ? 'https://cdn.discordapp.com/attachments/992423326301565029/1108453541619699833/eth-network.png'
                            : '') +
                          (curr.chain_id.toString() === '56'
                            ? 'https://cdn.discordapp.com/attachments/992423326301565029/1108454109939499088/bsc-network.png'
                            : '') +
                          (curr.chain_id.toString() === '137'
                            ? 'https://cdn.discordapp.com/attachments/992423326301565029/1108455132699570196/polygon-network.png'
                            : '') +
                          (curr.chain_id.toString() === '43114'
                            ? 'https://cdn.discordapp.com/attachments/992423326301565029/1108455307715280896/avax-network.png'
                            : '')
                        }
                      />
                    </div>

                    <div
                      className={cn(
                        style[
                          'complastadts-audits-item-imgnamesymbol-namesymbol'
                        ]
                      )}
                    >
                      <div
                        className={cn(
                          style[
                            'complastadts-audits-item-imgnamesymbol-namesymbol-symbol'
                          ]
                        )}
                      >
                        {curr.symbol}
                      </div>

                      <div
                        className={cn(
                          style[
                            'complastadts-audits-item-imgnamesymbol-namesymbol-name'
                          ]
                        )}
                      >
                        {curr.name}
                      </div>
                    </div>
                  </div>

                  <div className={cn(style['complastadts-audits-item-date'])}>
                    {curr.created_at}
                  </div>

                  <div
                    className={cn(style['complastadts-audits-item-network'])}
                  >
                    {curr.chain_id.toString() === '56' ? 'BSC' : null}
                    {curr.chain_id.toString() === '1' ? 'ETH' : null}
                    {curr.chain_id.toString() === '137' ? 'POLYGON' : null}
                  </div>

                  <a
                    href={
                      'https://app.safubase.com/audits/' +
                      curr.address +
                      '?chain_id=' +
                      curr.chain_id
                    }
                    className={cn(style['complastadts-audits-item-btn'])}
                  >
                    VIEW
                  </a>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

/**
 *
 * NEWSLETTER COMPONENT
 *
 *
 */
class Comp_newsletter extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compnewsletter'])}>
        <div className={cn(style['compnewsletter-title'])}>
          Sign up our mailing list to receive our new presales, features, tips
          and reviews for next 100x projects.
        </div>

        <input
          className={cn(style['compnewsletter-input'])}
          placeholder="Enter your email address..."
        />

        <div className={cn(style['compnewsletter-button'])}>Subscribe</div>
      </div>
    );
  }
}

/**
 *
 * PROFILE & INPUT ON RIGHT COMPONENT
 *
 *
 * */
class Comp_profile_input extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      search_value: '',
      address: '',
      price: 0,
    };

    this.address_set = this.address_set.bind(this);
  }

  address_set() {
    if (!this.context.state.wallet_address && this.state.address) {
      this.setState({
        ...this.state,
        address: '',
      });

      return;
    }

    if (this.context.state.wallet_address && !this.state.address) {
      let address = this.context.state.wallet_address;

      address =
        address[0] +
        address[1] +
        address[2] +
        address[3] +
        '...' +
        address[address.length - 3] +
        address[address.length - 2] +
        address[address.length - 1];

      this.setState({
        ...this.state,
        address: address,
      });
    }
  }

  componentDidMount() {
    axios
      .get(
        'https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000'
      )
      .then((res) => {
        this.setState({
          ...this.state,
          price: Number(res.data.price).toFixed(2),
        });
      });

    setInterval(() => {
      axios
        .get(
          'https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000'
        )
        .then((res) => {
          this.setState({
            ...this.state,
            price: Number(res.data.price).toFixed(2),
          });
        });
    }, 4000);
  }

  componentDidUpdate() {
    this.address_set();
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compprofileinput'])}>
        <div className={cn(style['compprofileinput-left'])}>
          <div className={cn(style['compprofileinput-left-input'])}>
            <Icon_search />

            <input
              value={this.state.search_value}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  search_value: e.target.value,
                });
              }}
              placeholder="Search..."
            />
          </div>
        </div>

        <div className={cn(style['compprofileinput-right'])}>
          <a
            href="https://presale.safubase.com"
            target="_blank"
            className={cn(style['compprofileinput-right-buynow'])}
          >
            <div className={cn(style['compprofileinput-right-buynow-top'])}>
              <span
                className={cn(style['compprofileinput-right-buynow-top-token'])}
              >
                SAFUBASE
              </span>

              <span
                className={cn(style['compprofileinput-right-buynow-top-price'])}
              >
                ${this.state.price}
              </span>
            </div>

            <div
              className={cn(
                style['compprofileinput-right-buynow-bottom-title']
              )}
            >
              BUY NOW
            </div>
          </a>

          <button
            className={cn(style['compprofileinput-right-conwallet'])}
            onClick={async () => {
              const accounts = await UTILS.wallet_connect({ chain_id: 56 });

              if (accounts === null) {
                this.context.set_state({
                  ...this.context.state,
                  ui_toasts: [
                    ...this.context.state.ui_toasts,
                    {
                      type: 'error',
                      message: 'No web3 wallet detected in the browser',
                      created_at: new Date(),
                    },
                  ],
                });

                return;
              }

              this.context.set_state({
                ...this.context.state,
                wallet_address: accounts[0],
              });
            }}
          >
            {this.state.address || 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }
}

/**
 *
 * PROFILE & INPUT ON RIGHT COMPONENT
 *
 *
 * */
class Comp_profile_input_mobile extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      search_value: '',
      address: '',
      price: 0,
    };

    this.address_set = this.address_set.bind(this);
  }

  address_set() {
    if (!this.context.state.wallet_address && this.state.address) {
      this.setState({
        ...this.state,
        address: '',
      });

      return;
    }

    if (this.context.state.wallet_address && !this.state.address) {
      let address = this.context.state.wallet_address;

      address =
        address[0] +
        address[1] +
        address[2] +
        address[3] +
        '...' +
        address[address.length - 3] +
        address[address.length - 2] +
        address[address.length - 1];

      this.setState({
        ...this.state,
        address: address,
      });
    }
  }

  componentDidMount() {
    axios
      .get(
        'https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000'
      )
      .then((res) => {
        this.setState({
          ...this.state,
          price: Number(res.data.price).toFixed(2),
        });
      });

    setInterval(() => {
      axios
        .get(
          'https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000'
        )
        .then((res) => {
          this.setState({
            ...this.state,
            price: Number(res.data.price).toFixed(2),
          });
        });
    }, 4000);
  }

  componentDidUpdate() {
    this.address_set();
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compprofileinputmobile'])}>
        <a
          href="https://safubase.com"
          target="_blank"
          className={cn(style['compprofileinputmobile-buynow'])}
        >
          <div className={cn(style['compprofileinputmobile-buynow-top'])}>
            <span
              className={cn(style['compprofileinputmobile-buynow-top-token'])}
            >
              SAFUBASE
            </span>

            <span
              className={cn(style['compprofileinputmobile-buynow-top-price'])}
            >
              ${this.state.price}
            </span>
          </div>

          <div
            className={cn(style['compprofileinputmobile-buynow-bottom-title'])}
          >
            BUY NOW
          </div>
        </a>

        <button
          className={cn(style['compprofileinputmobile-conwallet'])}
          onClick={async () => {
            const wallet_accounts = await UTILS.wallet_connect({
              chain_id: 56,
            });

            if (wallet_accounts === null) {
              this.context.set_state({
                ...this.context.state,
                ui_toasts: [
                  ...this.context.state.ui_toasts,
                  {
                    type: 'error',
                    message: 'No web3 wallet detected in the browser',
                    created_at: new Date(),
                  },
                ],
              });

              return;
            }

            this.context.set_state({
              ...this.context.state,
              wallet_address: wallet_accounts[0],
            });
          }}
        >
          {this.state.address || 'Connect Wallet'}
        </button>
      </div>
    );
  }
}

/**
 *
 * WHALEE TRACKER COMPONENT
 *
 */
class Comp_whale_tracker extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      info_main_hover: false,
      chains_dd_open: false,
      chain: {
        img: '/images/tokens/btc.png',
        name: 'All chain',
        chain: 'all',
        chain_id: 0,
      },
      chains: [
        {
          img: '/images/tokens/btc.png',
          name: 'All chain',
          chain: 'all',
          chain_id: 0,
        },
        {
          img: '/images/tokens/btc.png',
          name: 'Bitcoin',
          chain: 'bitcoin',
          chain_id: 1,
        },
        {
          img: '/images/tokens/bnb.png',
          name: 'BSC',
          chain: 'binancechain',
          chain_id: 56,
        },
        {
          img: '/images/tokens/eth.png',
          name: 'Ethereum',
          chain: 'ethereum',
          chain_id: 1,
        },
      ],
      api_data: [],
      api_loading: false,
      api_updating: false,
    };

    this.str_reduce_row_name_chars = this.str_reduce_row_name_chars.bind(this);
    this.api_update = this.api_update.bind(this);
  }

  str_reduce_row_name_chars(str, offset = 13) {
    let new_str = '';
    const parts = str.split(' ');

    for (let i = 0; i < parts.length; i++) {
      if (new_str.length + parts[i].length <= offset) {
        new_str = new_str + parts[i] + ' ';
      } else {
        break;
      }
    }

    return new_str;
  }

  async api_update(update = false) {
    if (update) {
      this.setState({
        ...this.state,
        api_loading: false,
        api_updating: true,
      });
    } else {
      this.setState({
        ...this.state,
        api_loading: true,
        api_updating: false,
      });
    }

    const res = await UTILS_API.blockchain_get_whales(
      1,
      this.state.chain.chain
    );

    if (res.code) {
      this.setState({
        ...this.state,
        chains: [...this.state.chains],
        api_data: [],
        api_loading: false,
        api_updating: false,
      });

      return;
    }

    for (let i = 0; i < res.data.length; i++) {
      for (let j = 0; j < res.data.length; j++) {
        if (res.data[j + 1]) {
          const current = res.data[j];
          const next = res.data[j + 1];

          if (
            new Date(current.date).valueOf() < new Date(next.date).valueOf()
          ) {
            res.data[j] = next;
            res.data[j + 1] = current;
          }
        }
      }
    }

    this.setState({
      ...this.state,
      chains: [...this.state.chains],
      api_data: res.data,
      api_loading: false,
      api_updating: false,
    });
  }

  componentDidMount() {
    this.api_update();

    setInterval(() => {
      this.api_update(true);
    }, 25000);
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div id="compwhaletracker" className={cn(style['compwhaletracker'])}>
        <div className={cn(style['compwhaletracker-config'])}>
          <div className={cn(style['compwhaletracker-config-title'])}>
            Whales Tracker
            <div
              onMouseOver={() => {
                this.setState({
                  ...this.state,
                  info_main_hover: true,
                });
              }}
              onMouseLeave={() => {
                this.setState({
                  ...this.state,
                  info_main_hover: false,
                });
              }}
              className={cn(style['compwhaletracker-config-title-i'])}
            >
              <Icon_info />

              <div
                className={cn(
                  style['compwhaletracker-config-title-i-modal'],
                  this.state.info_main_hover
                    ? style['compwhaletracker-config-title-i-modalactive']
                    : null
                )}
              >
                The latest big trades performed by whales accros every
                integrated blockchain.
              </div>
            </div>
          </div>

          <div className={cn(style['compwhaletracker-config-chaindd'])}>
            <div
              onClick={() => {
                // toggle dropdown
                this.setState({
                  ...this.state,
                  chains_dd_open: !this.state.chains_dd_open,
                });
              }}
              className={cn(style['compwhaletracker-config-chaindd-selected'])}
            >
              {this.state.chain.chain === 'all' ? (
                <div
                  className={cn(
                    style['compwhaletracker-config-chaindd-selected-imgctr']
                  )}
                >
                  <img src="/images/tokens/btc.png" />
                  <img src="/images/tokens/eth.png" />
                  <img src="/images/tokens/bnb.png" />
                </div>
              ) : (
                <img src={this.state.chain.img} />
              )}

              {this.state.chains_dd_open ? (
                <Icon_arrow dir="up" />
              ) : (
                <Icon_arrow dir="down" />
              )}
            </div>

            <div
              className={cn(
                style['compwhaletracker-config-chaindd-options'],
                this.state.chains_dd_open
                  ? style['compwhaletracker-config-chaindd-optionsactive']
                  : null
              )}
            >
              {this.state.chains.map((curr, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      style['compwhaletracker-config-chaindd-options-item']
                    )}
                    onClick={async () => {
                      this.setState({
                        ...this.state,
                        chain: curr,
                        chains: [...this.state.chains],
                        chains_dd_open: false,
                        api_data: [...this.state.api_data],
                        api_loading: true,
                        api_updating: false,
                      });

                      const res = await UTILS_API.blockchain_get_whales(
                        1,
                        curr.chain
                      );

                      if (res.code) {
                        this.setState({
                          ...this.state,
                          chains: [...this.state.chains],
                          chains_dd_open: false,
                          api_data: [],
                          api_loading: false,
                        });

                        return;
                      }

                      for (let i = 0; i < res.data.length; i++) {
                        for (let j = 0; j < res.data.length; j++) {
                          if (res.data[j + 1]) {
                            const current = res.data[j];
                            const next = res.data[j + 1];

                            if (
                              new Date(current.date).valueOf() <
                              new Date(next.date).valueOf()
                            ) {
                              res.data[j] = next;
                              res.data[j + 1] = current;
                            }
                          }
                        }
                      }

                      this.setState({
                        ...this.state,
                        chains: [...this.state.chains],
                        chains_dd_open: false,
                        api_data: res.data,
                        api_loading: false,
                      });
                    }}
                  >
                    {curr.chain === 'all' ? (
                      <div
                        className={cn(
                          style[
                            'compwhaletracker-config-chaindd-options-item-imgctr'
                          ]
                        )}
                      >
                        <img src="/images/tokens/btc.png" />
                        <img src="/images/tokens/eth.png" />
                        <img src="/images/tokens/bnb.png" />
                      </div>
                    ) : (
                      <img src={curr.img} />
                    )}

                    <div
                      className={cn(
                        style[
                          'compwhaletracker-config-chaindd-options-item-name'
                        ]
                      )}
                    >
                      {curr.name}
                    </div>

                    <input
                      className={cn(
                        style[
                          'compwhaletracker-config-chaindd-options-item-check'
                        ]
                      )}
                      type="checkbox"
                      checked={this.state.chain.name === curr.name}
                      onChange={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={cn(style['compwhaletracker-titles'])}>
          <div className={cn(style['compwhaletracker-titles-name'])}>Token</div>

          <div className={cn(style['compwhaletracker-titles-amount'])}>
            From -{'>'} To
          </div>

          <div className={cn(style['compwhaletracker-titles-maker'])}>Date</div>
        </div>

        <div
          className={cn(
            style['compwhaletracker-rows'],
            this.state.api_updating
              ? style['compwhaletracker-rowsupdating']
              : null
          )}
        >
          {this.state.api_loading ? (
            <div className={cn(style['compwhaletracker-rows-loading'])}>
              <Icon_loading />
            </div>
          ) : (
            this.state.api_data.map((curr, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    style['compwhaletracker-rows-row'],
                    curr.type === 'sell'
                      ? style['compwhaletracker-rows-rowredbg']
                      : style['compwhaletracker-rows-rowgreenbg']
                  )}
                >
                  <div
                    className={cn(
                      style['compwhaletracker-rows-row-imgnamesymbol']
                    )}
                  >
                    <img src={'/images/tokens/' + curr.symbol + '.png'} />

                    <div
                      className={cn(
                        style[
                          'compwhaletracker-rows-row-imgnamesymbol-namesymbol'
                        ]
                      )}
                    >
                      <div
                        className={cn(
                          style[
                            'compwhaletracker-rows-row-imgnamesymbol-namesymbol-symbol'
                          ]
                        )}
                      >
                        ${UTILS.num_add_commas(curr.amount_usd)}
                      </div>

                      <div
                        className={cn(
                          style[
                            'compwhaletracker-rows-row-imgnamesymbol-namesymbol-name'
                          ]
                        )}
                      >
                        {UTILS.num_add_commas(curr.amount)}
                        {/**          <strong>{curr.symbol.toUpperCase()}</strong> */}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(style['compwhaletracker-rows-row-amount'])}
                  >
                    <span
                      onClick={async () => {
                        await UTILS.str_copy(curr.from_address);

                        this.context.set_state({
                          ...this.context.state,
                          ui_toasts: [
                            ...this.context.state.ui_toasts,
                            {
                              type: 'success',
                              message: 'Address successfully copied',
                              created_at: new Date(),
                            },
                          ],
                        });
                      }}
                    >
                      {curr.from_address[0] +
                        curr.from_address[1] +
                        curr.from_address[2] +
                        curr.from_address[3] +
                        '..' +
                        curr.from_address[curr.from_address.length - 4] +
                        curr.from_address[curr.from_address.length - 3] +
                        curr.from_address[curr.from_address.length - 2] +
                        curr.from_address[curr.from_address.length - 1]}
                    </span>{' '}
                    -{'>'}{' '}
                    <span
                      onClick={async () => {
                        await UTILS.str_copy(curr.to_address);

                        this.context.set_state({
                          ...this.context.state,
                          ui_toasts: [
                            ...this.context.state.ui_toasts,
                            {
                              type: 'success',
                              message: 'Address successfully copied',
                              created_at: new Date(),
                            },
                          ],
                        });
                      }}
                    >
                      <span>
                        {curr.to_address[0] +
                          curr.to_address[1] +
                          curr.to_address[2] +
                          curr.to_address[3] +
                          '..' +
                          curr.to_address[curr.to_address.length - 4] +
                          curr.to_address[curr.to_address.length - 3] +
                          curr.to_address[curr.to_address.length - 2] +
                          curr.to_address[curr.to_address.length - 1]}
                      </span>
                    </span>
                  </div>

                  <div
                    onClick={async () => {
                      //await UTILS.str_copy(curr.maker);
                    }}
                    className={cn(style['compwhaletracker-rows-row-maker'])}
                  >
                    {/**
                     * 
                     *   curr.maker[0] +
                      curr.maker[1] +
                      curr.maker[2] +
                      curr.maker[3] +
                      '..' +
                      curr.maker[curr.maker.length - 4] +
                      curr.maker[curr.maker.length - 3] +
                      curr.maker[curr.maker.length - 2] +
                      curr.maker[curr.maker.length - 1]
                     */}
                    {curr.date.split('T')[0]}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

/**
 *
 * UPCOMING UNLOCKS COMPONENT
 *
 */
class Comp_upcoming_unlocks extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      info_main_hover: false,
      api_data: [],
      api_loading: true,
      api_updating: false,
    };

    this.str_reduce_row_name_chars = this.str_reduce_row_name_chars.bind(this);
    this.date_display = this.date_display.bind(this);
    this.api_update = this.api_update.bind(this);
  }

  str_reduce_row_name_chars(str, offset = 13) {
    let new_str = '';
    const parts = str.split(' ');

    for (let i = 0; i < parts.length; i++) {
      if (new_str.length + parts[i].length <= offset) {
        new_str = new_str + parts[i] + ' ';
      } else {
        break;
      }
    }

    return new_str;
  }

  date_display(remaining_s) {
    const remaining_m = parseInt(remaining_s / 60);

    if (remaining_m < 60) {
      return remaining_m + ' minute';
    }

    const remaining_h = parseInt(remaining_m / 60);

    if (remaining_h < 24) {
      return remaining_h + ' hours';
    }

    const remaining_d = parseInt(remaining_h / 24);

    return remaining_d + ' days';
  }

  async api_update(animate = false) {
    if (animate) {
      this.setState({
        ...this.state,
        api_loading: false,
        api_updating: true,
      });
    } else {
      this.setState({
        ...this.state,
        api_loading: true,
        api_updating: false,
      });
    }

    const res = await UTILS_API.blockchain_get_upcoming_unlocks(1);

    if (res.code) {
      this.setState({
        ...this.state,
        api_data: [],
        api_loading: false,
        api_updating: false,
      });

      return;
    }

    for (let i = 0; i < res.data.length; i++) {
      const credential_parts = res.data[i].credentials.split('____');

      let credentials = '';

      for (let j = 0; j < credential_parts.length; j++) {
        let start = false;

        for (let k = 0; k < credential_parts[j].length; k++) {
          if (credential_parts[j][k - 1] === '>') {
            start = true;
          }

          if (start) {
            credentials = credentials + credential_parts[j][k];
          }
        }

        credentials = credentials + '_';
      }

      res.data[i].credentials = credentials.split('_');

      let symbol = '';
      let locked_percentage = '';
      let symbol_start = false;

      for (let j = 0; j < res.data[i].symbol.length; j++) {
        if (res.data[i].symbol[j - 1] === '>' && !symbol) {
          symbol_start = true;
        }

        if (res.data[i].symbol[j] === '<') {
          symbol_start = false;
        }

        if (symbol_start) {
          symbol = symbol + res.data[i].symbol[j];
        }

        if (
          res.data[i].symbol[j] === '%' &&
          res.data[i].symbol[j + 1] === '"'
        ) {
          for (let k = j - 1; k > j - 50; k--) {
            if (res.data[i].symbol[k] === ':') {
              break;
            }

            locked_percentage = res.data[i].symbol[k] + locked_percentage;
          }
        }
      }

      res.data[i].symbol = symbol;

      res.data[i].name = res.data[i].credentials[1];

      res.data[i].usd_price = Number(
        res.data[i].credentials[2].replace('$', '')
      );

      if (res.data[i].credentials[3].includes('b')) {
        let value = Number(
          res.data[i].credentials[3].replace('$', '').replace('b', '')
        );

        for (let j = 0; j < 9; j++) {
          value = value * 10;
        }

        res.data[i].fdmc = value;
      } else if (res.data[i].credentials[3].includes('m')) {
        let value = Number(
          res.data[i].credentials[3].replace('$', '').replace('m', '')
        );

        for (let j = 0; j < 6; j++) {
          value = value * 10;
        }

        res.data[i].fdmc = value;
      } else if (res.data[i].credentials[3].includes('k')) {
        let value = Number(
          res.data[i].credentials[3].replace('$', '').replace('k', '')
        );

        for (let j = 0; j < 3; j++) {
          value = value * 10;
        }

        res.data[i].fdmc = value;
      }

      res.data[i].total_supply = Number(
        res.data[i].credentials[4].split('<')[0].replace(/,/g, '')
      );

      res.data[i].locked_supply =
        (res.data[i].total_supply / 100) * locked_percentage;

      if (res.data[i].credentials[5].includes('b')) {
        let value = Number(
          res.data[i].credentials[5].replace('$', '').replace('b', '')
        );

        for (let j = 0; j < 9; j++) {
          value = value * 10;
        }

        res.data[i].market_cap = value;
      } else if (res.data[i].credentials[5].includes('m')) {
        let value = Number(
          res.data[i].credentials[5].replace('$', '').replace('m', '')
        );

        for (let j = 0; j < 6; j++) {
          value = value * 10;
        }

        res.data[i].market_cap = value;
      } else if (res.data[i].credentials[5].includes('k')) {
        let value = Number(
          res.data[i].credentials[5].replace('$', '').replace('k', '')
        );

        for (let j = 0; j < 3; j++) {
          value = value * 10;
        }

        res.data[i].market_cap = value;
      }

      res.data[i].unlock_date = Date.now() / 1000 + 123;
    }

    this.setState({
      ...this.state,
      api_data: res.data,
      api_loading: false,
      api_updating: false,
    });
  }

  componentDidMount() {
    this.api_update();

    setInterval(() => {
      this.api_update(true);
    }, 45000);
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div
        id="compupcomingunlocks"
        className={cn(style['compupcomingunlocks'])}
      >
        <div className={cn(style['compupcomingunlocks-config'])}>
          <div className={cn(style['compupcomingunlocks-config-title'])}>
            Upcoming Token Unlocks
            <div
              onMouseOver={() => {
                this.setState({
                  ...this.state,
                  info_main_hover: true,
                });
              }}
              onMouseLeave={() => {
                this.setState({
                  ...this.state,
                  info_main_hover: false,
                });
              }}
              className={cn(style['compupcomingunlocks-config-title-i'])}
            >
              <Icon_info />

              <div
                className={cn(
                  style['compupcomingunlocks-config-title-i-modal'],
                  this.state.info_main_hover
                    ? style['compupcomingunlocks-config-title-i-modalactive']
                    : null
                )}
              >
                The nearest token unlocks events, sorted by date
              </div>
            </div>
          </div>
        </div>

        <div className={cn(style['compupcomingunlocks-titles'])}>
          <div className={cn(style['compupcomingunlocks-titles-name'])}>
            Token
          </div>

          <div className={cn(style['compupcomingunlocks-titles-amount'])}>
            Amount
          </div>

          <div className={cn(style['compupcomingunlocks-titles-date'])}>
            Date
          </div>
        </div>

        <div
          className={cn(
            style['compupcomingunlocks-rows'],
            this.state.api_updating
              ? style['compupcomingunlocks-rowsupdating']
              : null
          )}
        >
          {this.state.api_loading ? (
            <div className={cn(style['compupcomingunlocks-rows-loading'])}>
              <Icon_loading />
            </div>
          ) : (
            this.state.api_data.map((curr, index) => {
              return (
                <a
                  key={index}
                  className={cn(style['compupcomingunlocks-rows-row'])}
                  href="#"
                  target="_blank"
                >
                  <div
                    className={cn(
                      style['compupcomingunlocks-rows-row-imgnamesymbol']
                    )}
                  >
                    <img src={curr.icon} />

                    <div
                      className={cn(
                        style[
                          'compupcomingunlocks-rows-row-imgnamesymbol-namesymbol'
                        ]
                      )}
                    >
                      <div
                        className={cn(
                          style[
                            'compupcomingunlocks-rows-row-imgnamesymbol-namesymbol-symbol'
                          ]
                        )}
                      >
                        {curr.symbol}
                      </div>

                      <div
                        className={cn(
                          style[
                            'compupcomingunlocks-rows-row-imgnamesymbol-namesymbol-name'
                          ]
                        )}
                      >
                        {this.str_reduce_row_name_chars(curr.name)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(style['compupcomingunlocks-rows-row-amount'])}
                  >
                    <div
                      className={cn(
                        style[
                          'compupcomingunlocks-rows-row-amount-lockedamount'
                        ]
                      )}
                    >
                      <Icon_lock />

                      <span>{UTILS.num_shorten(curr.locked_supply)}</span>

                      <span
                        className={cn(
                          style[
                            'compupcomingunlocks-rows-row-amount-lockedamount-percentage'
                          ]
                        )}
                      >
                        (
                        {(
                          curr.locked_supply /
                          (curr.total_supply / 100)
                        ).toFixed(2)}
                        %)
                      </span>
                    </div>

                    <div
                      className={cn(
                        style['compupcomingunlocks-rows-row-amount-usd']
                      )}
                    >
                      $
                      {UTILS.num_add_commas(
                        (curr.usd_price * curr.locked_supply).toFixed(2)
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(style['compupcomingunlocks-rows-row-date'])}
                  >
                    {/*
                    this.date_display(
                      curr.unlock_date - parseInt(Date.now() / 1000)
                    )
                    */}
                    -
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

/**
 *
 * * * PAGE
 *
 */
class Home extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      modal_presale_open: false,
    };

    this.init = this.init.bind(this);
  }

  async init() {
    const context_state = {
      ...this.context.state,
      ui_toasts: [],
    };

    /**
     *
     * ASYNC PROMISE CALLS
     *
     */ // [get_profile(), another_async_func()]

    const api_responses = await Promise.all([UTILS_API.get_profile(1)]);
    const api_res_get_profile = api_responses[0];

    if (api_res_get_profile.code) {
      context_state.ui_toasts = [
        ...context_state.ui_toasts,
        {
          type: 'error',
          message: api_res_get_profile.message,
          created_at: new Date(),
        },
      ];
    } else if (api_res_get_profile.data === null) {
      context_state.user_auth = false;
      context_state.user_id = null;
      context_state.user_username = null;
      context_state.user_email = null;
      context_state.user_email_verified = null;
      context_state.user_role = null;
      context_state.user_img = null;
    } else if (api_res_get_profile.data) {
      context_state.user_auth = true;
      context_state.user_id = api_res_get_profile.data._id;
      context_state.user_username = api_res_get_profile.data.username;
      context_state.user_email = api_res_get_profile.data.email;
      context_state.user_email_verified =
        api_res_get_profile.data.email_verified;
      context_state.user_role = api_res_get_profile.data.role;
      context_state.user_img = api_res_get_profile.data.img;
    }

    /**
     *
     * WALLET CONFIG
     *
     */

    UTILS.wallet_add_listeners(this.context);
    const wallet_accounts = await UTILS.wallet_req_accounts();

    if (wallet_accounts !== null && wallet_accounts[0]) {
      context_state.wallet_address = wallet_accounts[0];
    }

    /*
     *
     * CONTEXT UPDATE
     *
     */
    this.context.set_state(context_state);
  }

  /**
   *
   * PAGE INIT, event listener registrations, update wallet, many more
   *
   */
  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Head
          title="Safubase.com | Blockchain Security & Algo Trading with AI"
          desc="Contract audit, investment security and algo trading with artificial intelligence. Safubase is a security company."
        />

        <Layout_user>
          <section className={cn('section', style['sectiondash'])}>
            <div className={cn(style['sectiondash-left'])}>
              <Comp_profile_input_mobile />
              <Comp_hello />
              <Comp_input />
              <Comp_last_adts data={this.props.audits} />
            </div>

            <div className={cn(style['sectiondash-right'])}>
              <Comp_profile_input />
              <Comp_whale_tracker />
              <Comp_upcoming_unlocks />
            </div>
          </section>
        </Layout_user>
      </>
    );
  }
}

export default Home;
