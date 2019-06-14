import * as React from "react";
import { connect } from "react-redux";
import { fetchData } from "../store";
import { CO, CF, BaseState } from "../types";

interface HomeProps {
  circuits?: Array<CO>;
  fetchData: CF;
}


class Home extends React.Component<HomeProps, BaseState> {
  static serverFetch: () => (dispatch: CF) => any;
  constructor(props: HomeProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.props.circuits.length <= 0) {
      this.props.fetchData();
    }
  }

  handleClick() {
    console.log(123);
  }

  render() {
    const { circuits } = this.props;

    return (
      <div>
        <h2>F1 2018 Season Calendar</h2>
        <button onClick={this.handleClick}>click</button>
        <ul>
          {circuits.map(({ name }) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
Home.serverFetch = fetchData; // static declaration of data requirements

const mapStateToProps = (state: CO) => ({
  circuits: state.data
});

const mapDispatchToProps = {
  fetchData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
