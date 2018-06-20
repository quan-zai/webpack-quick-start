import { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'autobind-decorator';
import styles from './app.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: false,
        }
    }

    handleClick = () => {
        console.log('hehehe');
        this.setState((prevState, props) => {
            type: !prevState.type
        })
    }

    render() {
        return (
            <div>
                <header styleName="home" >首页</header>
                <button styleName="my_button" onClick={this.handleClick}>点我</button>
            </div>
        )
    }
}

export default App;