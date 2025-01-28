// MODULES
import React from 'react';
import cn from 'classnames';
import { FaCheck, FaTimes } from 'react-icons/fa';

// COMPONENTS
import Head from '../../components/head';
import Layout_user from '../../components/layouts/user';
import Linegraph from '../../components/graphs/line';

// COMPONENTS > ICONS
import Icon_chart from '../../components/icons/chart/index.js';
import Icon_copy from '../../components/icons/copy';

// CONTEXT
import { Context } from '../../context';

// UTILS
import UTILS from '../../utils/index.js';
import UTILS_API from '../../utils/api.js';

// STYLES
import style from '../../styles/pages/audits.module.css';

/**
 *
 * SERVER SIDE data processing layer, But it is better to do the math calculations in client side.
 *
 */
export async function getServerSideProps({ query }) {
  if (!query.address || !query.chain_id) {
    return {
      props: {
        code: 'ERR_BAD_REQUEST',
        message: 'Address or chain id is invalid',
      },
    };
  }

  const api_res_blockchain_audit = await UTILS_API.blockchain_audit(1, {
    address: query.address.toLowerCase(),
    chain_id: query.chain_id,
  });

  if (api_res_blockchain_audit.code) {
    return {
      props: api_res_blockchain_audit,
    };
  }

  return {
    props: api_res_blockchain_audit.data,
  };
}

/**
 *
 * CIRCLE COMPONENT
 * Will be used in other components because it is little complex by state
 *
 */
class Comp_circle extends React.Component {
  static contextType = Context;

  constructor(props) {
    // Initialization

    // ONLY EDIT THESE 3 VALUES
    const CANVAS_WIDTH = 180;
    const CANVAS_HEIGHT = 180;
    const LINE_WIDTH = 26;
    const R = CANVAS_WIDTH / 2 - LINE_WIDTH / 2; // formula of maximum radius without losing content

    super(props);
    this.state = {
      CANVAS_WIDTH: CANVAS_WIDTH,
      CANVAS_HEIGHT: CANVAS_HEIGHT,
      LINE_WIDTH: LINE_WIDTH,
      R: R,
    };

    // functions
    this.setup = this.setup.bind(this);
    this.draw = this.draw.bind(this);

    // References of html elements
    this.ctr_ref = React.createRef();
    this.info_ref = React.createRef();
  }

  setup() {
    // Config html elements style and canvas
    const ctr_div = this.ctr_ref.current; // ctr_div stands for container div of the component which has compcircle container class

    ctr_div.style.width = this.state.CANVAS_WIDTH + 'px';
    ctr_div.style.height = this.state.CANVAS_HEIGHT + 'px';

    const frame_div = ctr_div.children[0];
    const canvas = ctr_div.children[1];

    frame_div.style.width = this.state.R * 2 + this.state.LINE_WIDTH + 'px';
    frame_div.style.height = this.state.R * 2 + this.state.LINE_WIDTH + 'px';

    frame_div.style.borderWidth = this.state.LINE_WIDTH + 'px';

    const ctx = canvas.getContext('2d');

    //ctx.lineCap = 'round';
    ctx.lineWidth = this.state.LINE_WIDTH;
    ctx.strokeStyle = 'rgb(243, 100, 84)';

    ctx.clearRect(0, 0, this.state.CANVAS_WIDTH, this.state.CANVAS_HEIGHT);

    return ctx;
  }

  draw(ctx) {
    /**
     * 
      First we declare global constant and normal variables, then we  interval the canvas path draw with the given configurations, at each security score (current angle passes the 49% percent of double pi) we initialize the color transition intervals. Even though main circle draw interval is done the color transition intervals will keep drawing the circle and color transition. So it does not matter what speed we set the color transition velocity
     *
     */

    // These interval config values can be edited
    const FPS = parseInt(1000 / 40); // Interval update milliseconds
    const FPS_COLOR_TRANS = parseInt(1000 / 60);
    const V = 0.08; // velocity of the circle drawing, velocity and FPS are related since they draw the circle together
    const V_COLOR_TRANS = 2.5; // velocity of the RGB Color transition of stroke style

    // Stroke RGB numbers, herbiji
    const STROKE_STYLE_LOW_SECURITY = [243, 100, 84];
    const STROKE_STYLE_MEDIUM_SECURITY = [240, 196, 16];
    const STROKE_STYLE_HIGH_SECURITY = [60, 204, 112];

    const STROKE_STYLE_CURRENT = [...STROKE_STYLE_LOW_SECURITY];

    let angle_current = 0;
    // Determine the end angle by multiplying props data by double pi mapped to 100%
    const ANGLE_END = ((Math.PI * 2) / 100) * Number(this.props.data || 0);

    const ANGLE_LOW_SECURITY_OFFSET = ((Math.PI * 2) / 100) * 49; // Low security score mapped to double pi
    const ANGLE_MID_SECURITY_OFFSET = ((Math.PI * 2) / 100) * 84; // Middle security score mapped to double pi

    let angle_mid_security_passed = false;
    let angle_high_security_passed = false;

    // Start drawing the circle progress
    const TIMER_MAIN = setInterval(() => {
      if (angle_current >= ANGLE_END) {
        clearInterval(TIMER_MAIN);
        return;
      }

      // update the current angle by velocity
      if (angle_current + V >= ANGLE_END) {
        angle_current = ANGLE_END;
      } else {
        angle_current = angle_current + V;
      }

      /**
       * Initialize the color transition interval after they passed specific security score
       */

      if (
        angle_current > ANGLE_LOW_SECURITY_OFFSET &&
        angle_current < ANGLE_MID_SECURITY_OFFSET &&
        !angle_mid_security_passed
      ) {
        // After circle passed the low security score

        const TIMER_COLOR_FADE = setInterval(() => {
          if (angle_high_security_passed) {
            clearInterval(TIMER_COLOR_FADE);
            return;
          }

          // Current rgb colors
          const CURRENT_RED = STROKE_STYLE_CURRENT[0];
          const CURRENT_GREEN = STROKE_STYLE_CURRENT[1];
          const CURRENT_BLUE = STROKE_STYLE_CURRENT[2];

          // Middle security colors
          const NEXT_RED = STROKE_STYLE_MEDIUM_SECURITY[0];
          const NEXT_GREEN = STROKE_STYLE_MEDIUM_SECURITY[1];
          const NEXT_BLUE = STROKE_STYLE_MEDIUM_SECURITY[2];

          if (NEXT_RED !== CURRENT_RED && NEXT_RED > CURRENT_RED) {
            STROKE_STYLE_CURRENT[0] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[0] >= NEXT_RED) {
              STROKE_STYLE_CURRENT[0] = NEXT_RED;
            }
          } else if (NEXT_RED !== CURRENT_RED && NEXT_RED < CURRENT_RED) {
            STROKE_STYLE_CURRENT[0] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[0] <= NEXT_RED) {
              STROKE_STYLE_CURRENT[0] = NEXT_RED;
            }
          }

          if (NEXT_GREEN !== CURRENT_GREEN && NEXT_GREEN > CURRENT_GREEN) {
            STROKE_STYLE_CURRENT[1] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[1] >= NEXT_GREEN) {
              STROKE_STYLE_CURRENT[1] = NEXT_GREEN;
            }
          } else if (
            NEXT_GREEN !== CURRENT_GREEN &&
            NEXT_GREEN < CURRENT_GREEN
          ) {
            STROKE_STYLE_CURRENT[1] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[1] <= NEXT_GREEN) {
              STROKE_STYLE_CURRENT[1] = NEXT_RED;
            }
          }

          if (NEXT_BLUE !== CURRENT_BLUE && NEXT_BLUE > CURRENT_BLUE) {
            STROKE_STYLE_CURRENT[2] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[2] >= NEXT_BLUE) {
              STROKE_STYLE_CURRENT[2] = NEXT_BLUE;
            }
          } else if (NEXT_BLUE !== CURRENT_BLUE && NEXT_BLUE < CURRENT_BLUE) {
            STROKE_STYLE_CURRENT[2] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[2] <= NEXT_BLUE) {
              STROKE_STYLE_CURRENT[2] = NEXT_BLUE;
            }
          }

          ctx.strokeStyle = `rgba(${STROKE_STYLE_CURRENT[0]}, ${STROKE_STYLE_CURRENT[1]}, ${STROKE_STYLE_CURRENT[2]})`;
          ctx.beginPath();

          ctx.clearRect(
            0,
            0,
            this.state.CANVAS_WIDTH,
            this.state.CANVAS_HEIGHT
          );

          ctx.arc(
            this.state.CANVAS_WIDTH / 2,
            this.state.CANVAS_HEIGHT / 2,
            this.state.R,
            0,
            angle_current
          );

          ctx.stroke();

          if (
            (STROKE_STYLE_CURRENT[0] === STROKE_STYLE_MEDIUM_SECURITY[0] &&
              STROKE_STYLE_CURRENT[1] === STROKE_STYLE_MEDIUM_SECURITY[1] &&
              STROKE_STYLE_CURRENT[2] === STROKE_STYLE_MEDIUM_SECURITY[2]) ||
            angle_high_security_passed
          ) {
            clearInterval(TIMER_COLOR_FADE);

            return;
          }
        }, FPS_COLOR_TRANS);

        angle_mid_security_passed = true;
      }

      if (
        angle_current > ANGLE_MID_SECURITY_OFFSET &&
        !angle_high_security_passed
      ) {
        // After circle passed the high security score
        const TIMER_COLOR_FADE = setInterval(() => {
          // Current rgb colors
          const CURRENT_RED = STROKE_STYLE_CURRENT[0];
          const CURRENT_GREEN = STROKE_STYLE_CURRENT[1];
          const CURRENT_BLUE = STROKE_STYLE_CURRENT[2];

          // Middle security colors
          const NEXT_RED = STROKE_STYLE_HIGH_SECURITY[0];
          const NEXT_GREEN = STROKE_STYLE_HIGH_SECURITY[1];
          const NEXT_BLUE = STROKE_STYLE_HIGH_SECURITY[2];

          if (NEXT_RED !== CURRENT_RED && NEXT_RED > CURRENT_RED) {
            STROKE_STYLE_CURRENT[0] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[0] >= NEXT_RED) {
              STROKE_STYLE_CURRENT[0] = NEXT_RED;
            }
          } else if (NEXT_RED !== CURRENT_RED && NEXT_RED < CURRENT_RED) {
            STROKE_STYLE_CURRENT[0] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[0] <= NEXT_RED) {
              STROKE_STYLE_CURRENT[0] = NEXT_RED;
            }
          }

          if (NEXT_GREEN !== CURRENT_GREEN && NEXT_GREEN > CURRENT_GREEN) {
            STROKE_STYLE_CURRENT[1] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[1] >= NEXT_GREEN) {
              STROKE_STYLE_CURRENT[1] = NEXT_GREEN;
            }
          } else if (
            NEXT_GREEN !== CURRENT_GREEN &&
            NEXT_GREEN < CURRENT_GREEN
          ) {
            STROKE_STYLE_CURRENT[1] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[1] <= NEXT_GREEN) {
              STROKE_STYLE_CURRENT[1] = NEXT_GREEN;
            }
          }

          if (NEXT_BLUE !== CURRENT_BLUE && NEXT_BLUE > CURRENT_BLUE) {
            STROKE_STYLE_CURRENT[2] += V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[2] >= NEXT_BLUE) {
              STROKE_STYLE_CURRENT[2] = NEXT_BLUE;
            }
          } else if (NEXT_BLUE !== CURRENT_BLUE && NEXT_BLUE < CURRENT_BLUE) {
            STROKE_STYLE_CURRENT[2] -= V_COLOR_TRANS;

            if (STROKE_STYLE_CURRENT[2] <= NEXT_BLUE) {
              STROKE_STYLE_CURRENT[2] = NEXT_BLUE;
            }
          }

          ctx.strokeStyle = `rgba(${STROKE_STYLE_CURRENT[0]}, ${STROKE_STYLE_CURRENT[1]}, ${STROKE_STYLE_CURRENT[2]})`;
          ctx.beginPath();
          ctx.clearRect(
            0,
            0,
            this.state.CANVAS_WIDTH,
            this.state.CANVAS_HEIGHT
          );
          ctx.arc(
            this.state.CANVAS_WIDTH / 2,
            this.state.CANVAS_HEIGHT / 2,
            this.state.R,
            0,
            angle_current
          );
          ctx.stroke();

          if (
            STROKE_STYLE_CURRENT[0] === STROKE_STYLE_HIGH_SECURITY[0] &&
            STROKE_STYLE_CURRENT[1] === STROKE_STYLE_HIGH_SECURITY[1] &&
            STROKE_STYLE_CURRENT[2] === STROKE_STYLE_HIGH_SECURITY[2]
          ) {
            clearInterval(TIMER_COLOR_FADE);
            return;
          }
        }, FPS_COLOR_TRANS);

        angle_high_security_passed = true;
      }

      ctx.beginPath();

      ctx.clearRect(0, 0, this.state.CANVAS_WIDTH, this.state.CANVAS_HEIGHT);

      ctx.arc(
        this.state.CANVAS_WIDTH / 2,
        this.state.CANVAS_HEIGHT / 2,
        this.state.R,
        0,
        angle_current
      );

      ctx.stroke();

      // Display current percentage of the circle
      this.info_ref.current.innerHTML =
        parseInt(100 / ((Math.PI * 2) / angle_current)) + '%';
    }, FPS);
  }

  componentDidMount() {
    this.draw(this.setup());
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div ref={this.ctr_ref} className={cn(style['compcircle'])}>
        <div className={cn(style['compcircle-frame'])}>
          <div className={cn(style['compcircle-frame-shadow'])}></div>
          <div
            ref={this.info_ref}
            className={cn(style['compcircle-frame-info'])}
          ></div>
        </div>
        <canvas
          className={cn(style['compcircle-canvas'])}
          width={this.state.CANVAS_WIDTH}
          height={this.state.CANVAS_HEIGHT}
        ></canvas>
      </div>
    );
  }
}

/**
 *
 * SCROLL NUMBER COMPONENT
 *
 */
class Comp_scroll_number extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};

    this.ctr_ref = React.createRef();
  }

  componentDidMount() {
    const size = 19;
    const ctr_div = this.ctr_ref.current;

    ctr_div.style.fontSize = size + 'px';
    ctr_div.style.height = size + 'px';
    ctr_div.style.lineHeight = size + 'px';

    const dec = 23;
    const holder_count = this.props.data.toString();
    const holder_count_from = Number(holder_count) - dec;

    if (holder_count_from < 10) {
      ctr_div.textContent = holder_count;
      return;
    }

    // Create slot divs for each digit
    for (let i = 0; i < holder_count.length; i++) {
      const slot_div = document.createElement('div');

      slot_div.classList.add(style['compscrollnumber-slot']);

      ctr_div.appendChild(slot_div);
    }

    let ctr = 0;
    for (let i = holder_count.length - 1; i > -1; i--) {
      if (ctr === 0) {
        for (let j = 0; j < dec; j++) {
          const from_index_str = (holder_count_from + j + 1).toString();
          const digit = document.createElement('div');
          digit.textContent = from_index_str[from_index_str.length - 1];
          ctr_div.children[i].appendChild(digit);
        }
      }

      if (ctr === 1) {
        let digits = '';
        for (let j = 0; j < dec; j++) {
          const from_index_str = (holder_count_from + j + 1).toString();
          const digit = document.createElement('div');

          if (!digits.includes(from_index_str[from_index_str.length - 2])) {
            digit.textContent = from_index_str[from_index_str.length - 2];
            ctr_div.children[i].appendChild(digit);

            digits = digits + from_index_str[from_index_str.length - 2];
          }
        }
      }

      if (ctr !== 0 && ctr !== 1) {
        const digit = document.createElement('div');
        digit.textContent = holder_count[i];
        ctr_div.children[i].appendChild(digit);
      }

      ctr++;
    }

    for (let i = holder_count.length - 1; i > holder_count.length - 3; i--) {
      const height_total = ctr_div.children[i].children.length * size;
      ctr_div.children[i].style.height = height_total + 'px';
      ctr_div.children[i].style.top = '0';

      setTimeout(() => {
        ctr_div.children[i].style.top = '-' + (height_total - size) + 'px';
      }, 300);
    }
  }

  render() {
    return (
      <div ref={this.ctr_ref} className={cn(style['compscrollnumber'])}></div>
    );
  }
}

/**
 *
 * SCORE CARD COMPONENT
 *
 *
 */
class Comp_scores extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};

    this.progress_neutral_ref = React.createRef();
    this.progress_warnings_ref = React.createRef();
    this.progress_passed_ref = React.createRef();
  }

  componentDidMount() {
    const neutral_div = this.progress_neutral_ref.current;
    const warnings_div = this.progress_warnings_ref.current;
    const passed_div = this.progress_passed_ref.current;

    const neutral_count = this.props.data.neutral
      ? this.props.data.neutral.split('_').length
      : 0;

    const passed_count = this.props.data.passed
      ? this.props.data.passed.split('_').length
      : 0;

    const warnings_count = this.props.data.warnings
      ? this.props.data.warnings.split('_').length
      : 0;

    const neutral_percent = 100 / (8 / neutral_count);
    const warnings_percent = 100 / (8 / warnings_count);
    const passed_percent = 100 / (8 / passed_count);

    setTimeout(() => {
      neutral_div.style.width = neutral_percent + '%';
      warnings_div.style.width = warnings_percent + '%';
      passed_div.style.width = passed_percent + '%';
    }, 100);
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compscores'])}>
        <div className={cn(style['compscores-top'])}>
          <div className={cn(style['compscores-top-left'])}>
            <div className={cn(style['compscores-top-left-title'])}>
              {this.props.data.name || this.props.data.token_name} (
              {this.props.data.symbol || this.props.data.token_symbol})
              {this.props.data.chain_id === '56' ? (
                <img src="/images/tokens/bnb.png" />
              ) : null}
              {this.props.data.chain_id === '1' ? (
                <img src="/images/tokens/eth.png" />
              ) : null}
              {this.props.data.chain_id === '137' ? (
                <img src="/images/polygon.png" />
              ) : null}
              {this.props.data.chain_id === '' ? (
                <img src="/images/tokens/" />
              ) : null}
            </div>
            <div className={cn(style['compscores-top-left-address'])}>
              {this.props.data.address}
            </div>
          </div>

          <div className={cn(style['compscores-top-right'])}>
            Holders: <Comp_scroll_number data={this.props.data.holder_count} />
          </div>
        </div>

        <div className={cn(style['compscores-bottom'])}>
          <div className={cn(style['compscores-bottom-left'])}>
            <Comp_circle data={this.props.data.score} />

            <div className={cn(style['compscore-bottom-left-improvebtn'])}>
              <a href="https://onelink.to/tpjedj" target="_blank"><Icon_chart /> Download the App for New Gem Tokens</a>
            </div>
          </div>

          <div className={cn(style['compscores-bottom-right'])}>
            <div className={cn(style['compscores-bottom-right-desc'])}>
              The score of this contract address is{' '}
              <strong>{this.props.data.score}% out of 100.</strong> Upon
              detailed examination, <strong>3 important issues</strong> were
              discovered. <strong>Found 1 bug</strong> that is easy to fix. You
              can get information about these issues and get a service offer by
              contacting Safubase!
            </div>

            <div className={cn(style['compscores-bottom-right-barctr'])}>
              <div
                className={cn(style['compscores-bottom-right-barctr-label'])}
              >
                <span>
                  {this.props.data.neutral
                    ? this.props.data.neutral.split('_').length
                    : 0}
                </span>{' '}
                Ineffective
              </div>

              <div className={cn(style['compscores-bottom-right-barctr-bar'])}>
                <div
                  ref={this.progress_neutral_ref}
                  className={cn(
                    style['compscores-bottom-right-barctr-bar-progressfailed']
                  )}
                ></div>
              </div>
            </div>

            <div className={cn(style['compscores-bottom-right-barctr'])}>
              <div
                className={cn(style['compscores-bottom-right-barctr-label'])}
              >
                <span>
                  {this.props.data.warnings
                    ? this.props.data.warnings.split('_').length
                    : 0}
                </span>{' '}
                Warnings
              </div>

              <div className={cn(style['compscores-bottom-right-barctr-bar'])}>
                <div
                  ref={this.progress_warnings_ref}
                  className={cn(
                    style['compscores-bottom-right-barctr-bar-progresswarnings']
                  )}
                ></div>
              </div>
            </div>

            <div className={cn(style['compscores-bottom-right-barctr'])}>
              <div
                className={cn(style['compscores-bottom-right-barctr-label'])}
              >
                <span>
                  {this.props.data.passed
                    ? this.props.data.passed.split('_').length
                    : 0}
                </span>{' '}
                Passed
              </div>

              <div className={cn(style['compscores-bottom-right-barctr-bar'])}>
                <div
                  ref={this.progress_passed_ref}
                  className={cn(
                    style['compscores-bottom-right-barctr-bar-progresspassed']
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
 * CHECK BOX COMPONENT
 *
 */
class Comp_check_box extends React.Component {
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
      <div className={cn(style['compcheckboxes'])}>
        <div className={cn(style['compcheckboxes-row'])}>
          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.anti_whale === '1'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.anti_whale === '1' ? <FaCheck /> : <FaTimes />}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Anti Whale
            </div>
          </div>

          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_blacklisted === '1'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_blacklisted === '1' ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Blacklist
            </div>
          </div>
        </div>

        <div className={cn(style['compcheckboxes-row'])}>
          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_honeypot === '1'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_honeypot === '1' ? <FaCheck /> : <FaTimes />}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Honeypot
            </div>
          </div>

          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_mintable === '0'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_mintable === '0' ? <FaCheck /> : <FaTimes />}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Mintable
            </div>
          </div>
        </div>

        <div className={cn(style['compcheckboxes-row'])}>
          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_open_source === '1'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_open_source === '1' ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Open Source
            </div>
          </div>

          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_proxy === '0'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_proxy === '0' ? <FaCheck /> : <FaTimes />}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Proxy
            </div>
          </div>
        </div>

        <div className={cn(style['compcheckboxes-row'])}>
          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.is_whitelisted === '0'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.is_whitelisted === '0' ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Whitelisted
            </div>
          </div>

          <div className={cn(style['compcheckboxes-row-checkbox'])}>
            <div
              className={cn(
                style['compcheckboxes-row-checkbox-left'],
                this.props.data.selfdestruct === '0'
                  ? style['compcheckboxes-row-checkbox-leftsecure']
                  : null
              )}
            >
              {this.props.data.selfdestruct === '0' ? <FaCheck /> : <FaTimes />}
            </div>
            <div className={cn(style['compcheckboxes-row-checkbox-right'])}>
              Self Destruct
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 *
 * INFO BOX COMPONENT
 *
 */
class Comp_info_box extends React.Component {
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
      <div className={cn(style['compinfoboxes'])}>
        <div className={cn(style['compinfoboxes-row'])}>
          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Owner Address
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {UTILS.str_reduce(this.props.data.owner_address, 10) + '...'}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Owner Balance
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {Number(this.props.data.owner_balance).toFixed(2)}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Creator Address
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {UTILS.str_reduce(this.props.data.creator_address, 10) + '...'}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Creator Balance
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {Number(this.props.data.creator_balance).toFixed(2)}
            </div>
          </div>
        </div>
        <div className={cn(style['compinfoboxes-row'])}>
          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Buy Tax
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {this.props.data.buy_tax}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Sell Tax
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {this.props.data.sell_tax}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Slippage Modifiable
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {this.props.data.slippage_modifiable === '1' ? 'Yes' : 'No'}
            </div>
          </div>

          <div className={cn(style['compinfoboxes-row-box'])}>
            <div className={cn(style['compinfoboxes-row-box-key'])}>
              Personal Slippage Modifiable
            </div>
            <div className={cn(style['compinfoboxes-row-box-value'])}>
              {this.props.data.personal_slippage_modifiable === '1'
                ? 'Yes'
                : 'No'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 *
 * COMPONENT INFO BOX 2
 *
 */
class Comp_info_boxes2 extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};

    this.ctr_ref = React.createRef();
  }

  componentDidMount() {
    const ctr_div = this.ctr_ref.current;
    const child_len = ctr_div.children.length;
    let i = 0;

    const timer = setInterval(() => {
      if (i >= child_len) {
        clearInterval(timer);
        return;
      }

      ctr_div.children[i].classList.add(style['compinfoboxes2-boxactive']);

      i++;
    }, 250);
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div ref={this.ctr_ref} className={cn(style['compinfoboxes2'])}>
        <div className={cn(style['compinfoboxes2-titles'])}>
          <div className={cn(style['compinfoboxes2-titles-title'])}>TITLE</div>
          <div className={cn(style['compinfoboxes2-titles-desc'])}>
            DESCRIPTION
          </div>
          <div className={cn(style['compinfoboxes2-titles-value'])}>VALUE</div>
        </div>

        <div className={cn(style['compinfoboxes2-box'])}>
          <div className={cn(style['compinfoboxes2-box-title'])}>Address</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Indicates the token's address
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {UTILS.str_reduce(this.props.data.address, 8) + '...'}

            <Icon_copy
              onClick={async () => {
                await UTILS.str_copy(this.props.data.address);

                this.context.set_state({
                  ...this.context.state,
                  ui_toasts: [
                    ...this.context.state.ui_toasts,
                    {
                      type: 'success',
                      message: 'Address copied to clipboard',
                      created_at: new Date(),
                    },
                  ],
                });
              }}
            />
          </div>
        </div>

        <div className={cn(style['compinfoboxes2-box'])}>
          <div className={cn(style['compinfoboxes2-box-title'])}>Buy Tax</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Buy tax of the token
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {Number(this.props.data.buy_tax || 0).toFixed(2)}
          </div>
        </div>

        <div className={cn(style['compinfoboxes2-box'])}>
          <div className={cn(style['compinfoboxes2-box-title'])}>Sell Tax</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Sell tax of the token
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {Number(this.props.data.sell_tax || 0).toFixed(2)}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_mintable === '1'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>Mintable</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Shows if the token is mintable
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_mintable === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_anti_whale === '0'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>
            Anti Whale
          </div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Indicates wether a token has anti whale protection or not.
          </div>
          <div className={cn(style['compinfoboxes2-box-value'])}>
            {this.props.data.is_anti_whale === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_blacklisted === '1'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>
            Blacklisted
          </div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Indicates wether a token is blacklisted or not
          </div>
          <div className={cn(style['compinfoboxes2-box-value'])}>
            {this.props.data.is_blacklisted === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_proxy === '1'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>Proxy</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Indicates if a token is proxy
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_proxy === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_open_source === '0'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>
            Open Source
          </div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Shows if a token's source code is open source
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_open_source === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_honeypot === '1'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>Honeypot</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Shows if a token has Honeypot
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_honeypot === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_in_dex === '0'
              ? null
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>in DEX</div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Shows if the token is in DEX
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_in_dex === '1' ? 'Yes' : 'No'}
          </div>
        </div>

        <div
          className={cn(
            style['compinfoboxes2-box'],
            this.props.data.is_whitelisted === '1'
              ? style['compinfoboxes2-boxredbg']
              : style['compinfoboxes2-boxgreenbg']
          )}
        >
          <div className={cn(style['compinfoboxes2-box-title'])}>
            Whitelisted
          </div>
          <div className={cn(style['compinfoboxes2-box-desc'])}>
            Shows if the token is Whitelisted
          </div>
          <div className={cn(style['compinfoboxes2-box-value'], 'flxctrctr')}>
            {this.props.data.is_whitelisted === '1' ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    );
  }
}
/**
 *
 * PAGE
 *
 */
class Audits extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      line_graph_data: [],
    };
  }

  componentDidMount() {
    console.log(this.props);

    if (this.props.code) {
      this.context.set_state({
        ...this.context.state,
        ui_toasts: [
          ...this.context.state.ui_toasts,
          {
            type: 'error',
            message: this.props.message,
            created_at: new Date(),
          },
        ],
      });

      return;
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Head
          title={
            (this.props.name || this.props.token_name) +
            ' (' +
            (this.props.symbol || this.props.token_symbol) +
            ') | Blockchain Security with AI'
          }
          desc="Contract audit, investment security and algo trading with artificial intelligence. Safubase is a security company."
        />

        <Layout_user height="auto">
          <section className={cn('section', style['sectionaudits'])}>
            <div className={cn(style['sectionaudits-left'])}>
              <Comp_scores data={this.props} />
              <Comp_info_boxes2 data={this.props} />
            </div>

            <div className={cn(style['sectionaudits-right'])}>
              <iframe
                src={
                  'https://dexscreener.com/bsc/' +
                  this.props.address +
                  '?embed=1&theme=light&info=0&trades=0'
                }
              ></iframe>

              <a href="https://onelink.to/tpjedj" target="_blank"><img
                className={cn(style['anan'])}
                src="https://i.imgur.com/zkCVsM7.png"
              /> </a>
            </div>
          </section>
        </Layout_user>
      </>
    );
  }
}

export default Audits;
