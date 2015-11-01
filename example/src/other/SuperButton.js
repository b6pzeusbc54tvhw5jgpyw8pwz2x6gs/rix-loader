import React from 'react';
import StyleSheet from 'react-inline-for-rix-loader';

require('requirish')._(module);
var appUtil = require('src/appUtil');

//import appUtil from 'src/appUtil';
console.log('SuperButton');
const { oneOf, bool } = React.PropTypes;

class SuperButton extends React.Component {
  render() {
    return <div className={styles.default}></div>;
  }
}

SuperButton.propTypes = {
  size:   oneOf(['large', 'small']),
  block:  bool,
  busy:   bool
};

const rixContext = { size: 47 };
const { size } = rixContext;

export default SuperButton;
export { rixContext };

const styles = StyleSheet.create({
	default: {
		padding: '6px 12px',
		//fontSize: size,
		lineHeight: 1.5,
		cursor: 'pointer',
		border: '1px solid #2e6da4',
		borderRadius: 4,
		color: '#fff',
		backgroundColor: '#337ab7'
	}
});
