import React from 'react';
import StyleSheet from 'react-inline';
import cx from 'classnames';

//require('requirish')._(module);
//var SuperButton = require('src/other/SuperButton');
//var appUtil = require('src/appUtil');

//import SuperButton from './src/other/SuperButton';
//import appUtil from './src/appUtil';
//appUtil.hi();

const { oneOf, bool } = React.PropTypes;

class Button extends React.Component {
  render() {
    const { size, busy, block, className } = this.props;
    const classes = cx(styles.default, styles[size], block && styles.block, className);

    return <button {...this.props} className={classes} disabled={busy} >adda</button>;
  }
}

Button.propTypes = {
  size:   oneOf(['large', 'small']),
  block:  bool,
  busy:   bool
};

export default Button;
export function rixContext() {
	// 
	var a = 33;
	var b = 44;
	return { size: a+b / a, lineHeight: a+"px" };
};

const { size, lineHeight } = rixContext();

	//rixContext: function() {
//
	//}
//};

const styles = StyleSheet.create({
  default: {
    padding: '6px 12px',
    fontSize: size,
    lineHeight: lineHeight,
    cursor: 'pointer',
    border: '1px solid #2e6da4',
    borderRadius: 40,
    color: '#fff',
    backgroundColor: '#337ab7',

    '@media only screen and (max-width: 640px)': {
      display: 'block',
      width: '100%'
    },

    ':focus': {
      color: '#fff',
      backgroundColor: '#286090',
      borderColor: '#122b40'
    },

    '[disabled]': {
      backgroundColor: '#337ab7',
      borderColor: '#2e6da4',
      cursor: 'not-allowed',
      boxShadow: 'none',
      opacity: .65,
      pointerEvents: 'none'
    }
  },

  large: {
    padding: '10px 16px',
    fontSize: 18,
    lineHeight: 1.33,
    borderRadius: 6
  },

  small: {
    padding: '5px 10px',
    fontSize: 12,
    lineHeight: 1.5,
    borderRadius: 3
  },

  block: {
    display: 'block',
    width: '100%'
  }
});
