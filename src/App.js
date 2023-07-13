import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, {type ReactElement, useRef, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { type CSSObject, Global } from '@emotion/react';
import {
    createAppTheme,
    createAppStylesBaseline,
    type AnimatorGeneralProviderSettings,
    AnimatorGeneralProvider,
    Animator,
    Animated,
    aaVisibility,
    aa,
    type BleepsProviderSettings,
    BleepsProvider,
    useBleeps,
    BleepsOnAnimator,
    FrameSVGCorners,
    GridLines,
    Dots,
    MovingLines,
    Text, FrameSVGOctagon, useFrameSVGAssemblingAnimation
} from '@arwes/react';

const theme = createAppTheme();
const stylesBaseline = createAppStylesBaseline(theme);

const Background = (): ReactElement => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: theme.colors.primary.bg(1)
            }}
        >
            <GridLines lineColor={theme.colors.primary.deco(0)} />
            <Dots color={theme.colors.primary.deco(1)} />
            <MovingLines lineColor={theme.colors.primary.deco(2)} />
        </div>
    );
};

const Card = (): ReactElement => {
    const bleeps = useBleeps();

    return (
        <Animator merge combine manager='stagger'>
            {/* Play the intro bleep when card appears. */}
            <BleepsOnAnimator
                transitions={{ entering: 'intro' }}
                continuous
            />

            <Animated
                className='card'
                style={{
                    position: 'relative',
                    display: 'block',
                    maxWidth: '300px',
                    margin: theme.space([4, 'auto']),
                    padding: theme.space(8),
                    textAlign: 'center',
                    visibility: "visible!important"
                }}
                // Effects for entering and exiting animation transitions.
                animated={[aaVisibility(), aa('y', '2rem', 0)]}
                // Play bleep when the card is clicked.
                onClick={() => bleeps.click?.play()}
                hideOnExited={false}
                hideOnEntered={false}
            >
                {/* Frame decoration and shape colors defined by CSS. */}
                <style>{`
          .card .arwes-react-frames-framesvg [data-name=bg] {
            color: ${theme.colors.primary.deco(1)};
          }
          .card .arwes-react-frames-framesvg [data-name=line] {
            color: ${theme.colors.primary.main(4)};
          }
        `}</style>

                <Animator>
                    <FrameSVGCorners strokeWidth={2} />
                </Animator>

                <Animator>
                    <Text as='h1' hideOnExited={false}>
                        Tic Tac Toe
                    </Text>
                </Animator>

                {/*<Animator>*/}
                {/*    <Text key='1' hideOnExited={false}>*/}
                {/*    </Text>*/}
                {/*</Animator>*/}
                <Animator>
                    <Text key={'2'} hideOnExited={false}>
                        <Board />
                    </Text>
                </Animator>
            </Animated>
        </Animator>
    );
};

function Square({value, onSquareClick}) {

    return (
        <button
            className={"square"}
            onClick={onSquareClick}
        >
            {value}
        </button>);
};

function Board() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const winner = calculateWinner(squares);
    let status;
    let color;
    if (winner) {
        status = "Winner: " + winner;
        color = "success";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
        color = xIsNext ? "warning" : "error";
    }

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <>
            <blockquote data-arwes-global-palette={color}>{status}</blockquote>
            <div className="board-row">
              <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
              <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
              <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
              <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
              <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
              <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const animatorsSettings: AnimatorGeneralProviderSettings = {
    duration: {
        enter: 0.2,
        exit: 0.2,
        stagger: 0.04
    }
};

const bleepsSettings: BleepsProviderSettings = {
    master: {
        volume: 0.9
    },
    bleeps: {
        intro: {
            sources: [{ src: 'https://next.arwes.dev/assets/sounds/intro.mp3', type: 'audio/mpeg' }]
        },
        click: {
            sources: [{ src: 'https://next.arwes.dev/assets/sounds/click.mp3', type: 'audio/mpeg' }]
        }
    }
};

const SandboxGrid = (): ReactElement => {
    return (
        <>
            <Global styles={stylesBaseline } />
            <AnimatorGeneralProvider {...animatorsSettings}>
                <BleepsProvider {...bleepsSettings}>
                    <Animator active={true} combine manager='stagger'>
                        <Animator>
                            <Background />
                        </Animator>
                        <Animator>
                            <Card />
                        </Animator>
                    </Animator>
                </BleepsProvider>
            </AnimatorGeneralProvider>
        </>
    );
};

const Sandbox = (): ReactElement => (
    <main style={{ padding: '2rem' }}>
        <Global styles={stylesBaseline} />

        <h1>h1. Lorem ipsum lov sit amet</h1>
        <h2>h2. Lorem ipsum lov sit amet</h2>
        <h3>h3. Lorem ipsum lov sit amet</h3>
        <h4>h4. Lorem ipsum lov sit amet</h4>
        <h5>h5. Lorem ipsum lov sit amet</h5>
        <h6>h6. Lorem ipsum lov sit amet</h6>
        <hr />
        <p>
            Lorem ipsum lov sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
            Lorem ipsum <b>lov sit amet, consectetur</b> adipiscing elit.
        </p>
        <p>
            Lorem ipsum <i>lov sit amet, consectetur</i> adipiscing elit.
        </p>
        <p>
            Lorem ipsum <u>lov sit amet, consectetur</u> adipiscing elit.
        </p>
        <p>
            Lorem ipsum <small>lov sit amet, consectetur</small> adipiscing elit.
        </p>
        <p>
            Lorem ipsum <sup>lov sit</sup> amet, <sub>consectetur</sub> adipiscing elit.
        </p>
        <p>
            Lorem ipsum <a href='#'>lov sit amet, consectetur</a> adipiscing elit.
        </p>

        <ul>
            <li>Lorem ipsum lov sit amet.</li>
            <li>
                Lorem ipsum lov sit amet.
                <ul>
                    <li>Lorem ipsum lov sit amet.</li>
                    <li>Lorem ipsum lov sit amet.</li>
                    <li>Lorem ipsum lov sit amet.</li>
                </ul>
            </li>
            <li>Lorem ipsum lov sit amet.</li>
        </ul>

        <ol>
            <li>Lorem ipsum lov sit amet.</li>
            <li>
                Lorem ipsum lov sit amet.
                <ol>
                    <li>Lorem ipsum lov sit amet.</li>
                    <li>Lorem ipsum lov sit amet.</li>
                    <li>Lorem ipsum lov sit amet.</li>
                </ol>
            </li>
            <li>Lorem ipsum lov sit amet.</li>
        </ol>

        <p>
            Lorem ipsum <code>lov sit amet, consectetur</code> adipiscing elit.
        </p>
        <pre>
      Lorem ipsum lov sit amet.{'\n'}
            Lorem ipsum lov sit amet.{'\n'}
            Lorem ipsum lov sit amet.
    </pre>

        <blockquote>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>
        <blockquote data-arwes-global-palette='secondary'>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>
        <blockquote data-arwes-global-palette='info'>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>
        <blockquote data-arwes-global-palette='success'>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>
        <blockquote data-arwes-global-palette='warning'>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>
        <blockquote data-arwes-global-palette='error'>
            Lorem ipsum lov sit amet, consectetur adipiscing elit.
        </blockquote>

        <table>
            <thead>
            <tr>
                <th>Lorem ipsum</th>
                <th>Lov sit</th>
                <th>Amet, consectetur</th>
                <th>Adipiscing elit</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Lorem ipsum</td>
                <td>Lov sit</td>
                <td>Amet, consectetur</td>
                <td>Adipiscing elit</td>
            </tr>
            <tr>
                <td>Lorem ipsum</td>
                <td>Lov sit</td>
                <td>Amet, consectetur</td>
                <td>Adipiscing elit</td>
            </tr>
            <tr>
                <td>Lorem ipsum</td>
                <td>Lov sit</td>
                <td>Amet, consectetur</td>
                <td>Adipiscing elit</td>
            </tr>
            </tbody>
        </table>

        <figure>
            <img src='/assets/images/background-large.jpg' />
            <figcaption>Lorem ipsum lov sit amet.</figcaption>
        </figure>
    </main>
);

// createRoot(document.querySelector('#root') as HTMLElement).render(<Sandbox />);
export default SandboxGrid;