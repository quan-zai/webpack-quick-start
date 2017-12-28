import styles from './main.scss'
import ReactDOM from 'react-dom'
import Print from './print'

ReactDOM.render(
    <div>
        <h1 className={styles.h1}>22222222</h1>
        <img src={require('./browserify.png')} onClick={() => Print('hello world')} />
    </div>,
    document.getElementById('main')
)