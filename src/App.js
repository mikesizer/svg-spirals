import React, { Component } from 'react';
import styled from 'styled-components';

const NUMBER_OF_STROKES = 10;
const POINTS_PER_STROKE = 50;

const PATH_COLOUR = "#0F7AD4";
const SIZE = 400;
const MIN_LINE_LENGTH = 2;
const ANGLE = 360 / NUMBER_OF_STROKES;
const ALPHA_ITERATOR = (100 / POINTS_PER_STROKE) / 100;

const Container = styled.div`
  width: ${SIZE}px;
  height: ${SIZE}px;
  position: relative;
  background-color: #f2f2f2;
  cursor: none;
`;

const Svg = styled.svg.attrs({
  width: SIZE,
  height: SIZE,
})`
  top: 0;
  left: 0;
  position: absolute;
  transform-origin: 50% 50%;
  transform: rotate(${props => props.rotation}deg);
`;

class App extends Component {
  constructor() {
    super();

    this.state = {
      points: [],
    };
  }
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
  handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    let { x: lastX, y: lastY } = this.state.points[this.state.points.length - 1];
    const { left, top } = this.canvas.getBoundingClientRect();
    lastX += left;
    lastY += top;

    const maxX = Math.max(clientX, lastX);
    const minX = Math.min(clientX, lastX);
    const maxY = Math.max(clientY, lastY);
    const minY = Math.min(clientY, lastY);
    const xDist = maxX - minX;
    const yDist = maxY - minY;
    const pathLength = Math.sqrt(xDist * xDist + yDist * yDist);
    if (pathLength < MIN_LINE_LENGTH) return;

    this.setState(prevState => {
      if (prevState.points.length > POINTS_PER_STROKE) prevState.points.shift();
      points: prevState.points.push({ x: clientX - left, y: clientY - top })
    });
  }
  handleMouseDown = (e) => {
    this.setState(prevState => {
      points: prevState.points.push({ x: -1, y: -1 })
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  renderPath = (p, i, n) => {
    if (i < 1) return;

    const { x: prevX, y: prevY } = this.state.points[i - 1];

    if (prevX === -1 || prevY === -1 || p.x === -1 || p.y === -1) return;

    const pathData = `M ${prevX} ${prevY} L ${p.x} ${p.y}`;
    const opacity = ALPHA_ITERATOR * i;

    return (
      <path
        key={i + n}
        d={pathData}
        stroke={PATH_COLOUR}
        strokeWidth="2"
        strokeOpacity={opacity}
      />
    );
  }
  render() {
    const {
      state: {
        points
      },
      renderPath,
      handleMouseDown,
    } = this;

    const strokes = [];
    for (let n = 0; n < NUMBER_OF_STROKES; n++) {
      strokes.push(
        <Svg
          key={n}
          rotation={ANGLE * n}
        >
          {
            points.map((p, i) => renderPath(p, i, n))
          }
        </Svg>
      );
    }

    return (
      <Container
          innerRef={div => this.canvas = div}
          onMouseDown={handleMouseDown}
        >
          { strokes }
      </Container>
    );
  }
}

export default App;
