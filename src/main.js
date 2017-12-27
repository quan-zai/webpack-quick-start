import styles from './main.scss'
import ReactDOM from 'react-dom'
require('./main1')
require('./main2')

ReactDOM.render(
    <div>
        <h1 className={styles.h1}>hahaha</h1>
        <img src={require('./browserify.png')} alt=""/>
    </div>,
    document.getElementById('main')
)