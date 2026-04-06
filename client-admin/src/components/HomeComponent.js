import React, { Component } from 'react';
import anh from '../asset/imgs/anh.jpg';
class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ADMIN HOME</h2>
        <img
          src={anh}
          width="800px"
          height="600px"
          alt=""
        />
      </div>
    );
  }
}

export default Home;
