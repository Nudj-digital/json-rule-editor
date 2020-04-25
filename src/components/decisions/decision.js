import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolBar from '../toolbar/toolbar';
import AddDecision from './add-decision';
import DecisionDetails from './decision-details';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { transformRuleToTree } from '../../utils/transform';

class Decision extends Component {

    constructor(props){
        super(props);
        this.state={showAddRuleCase: false,
             editCaseFlag: false,
             editCondition: [],
             message: Message.NO_DECISION_MSG,
             decisions: props.decisions || []};
        this.handleAdd = this.handleAdd.bind(this);
        this.updateCondition = this.updateCondition.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleSearch = () => {

    }

    handleAdd = () => {
        this.setState({showAddRuleCase: true});
    }

    cancelAddAttribute = () => {
        this.setState({showAddRuleCase: false, editCaseFlag: false});
    }

    editCondition(decisionIndex) {
        const decision = this.props.decisions[decisionIndex];
        const editCondition = transformRuleToTree(decision);
        this.setState({ editCaseFlag: true, editCondition, 
            editDecisionIndex: decisionIndex, 
            editOutcome: {value: decision.event.type }});
    }

    addCondition(condition) {
        this.props.handleDecisions('ADD', { condition });
        this.setState({showAddRuleCase: false});
    }

    updateCondition(condition) {
        this.props.handleDecisions('UPDATE', { condition, 
            decisionIndex: this.state.editDecisionIndex });
        this.setState({editCaseFlag: false});
    }

    removeCase(decisionIndex) {
        this.props.handleDecisions('REMOVECONDITION', { decisionIndex});
    }

    removeDecisions(outcome) {
        this.props.handleDecisions('REMOVEDECISIONS', { outcome});
    }

    handleReset() {
        this.props.handleDecisions('RESET');
    }


    render() {
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        const editButtonProps = { primaryLabel: 'Edit Rulecase', secondaryLabel: 'Cancel'};
        const { outcomes } = this.props;
        return (<div className="rulecases-container">
            { Object.keys(outcomes).length > 0 && <ToolBar handleAdd={this.handleAdd} submit={this.props.submit} reset={this.handleReset} /> }
            {this.state.showAddRuleCase && <AddDecision attributes={this.props.attributes} addCondition={this.addCondition} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            {this.state.editCaseFlag && <AddDecision attributes={this.props.attributes} editCondition={this.state.editCondition}
                 outcome={this.state.editOutcome} editDecision addCondition={this.updateCondition} cancel={this.cancelAddAttribute} buttonProps={editButtonProps} />}
            <DecisionDetails outcomes={outcomes} editCondition={this.editCondition} removeCase={this.removeCase} removeDecisions={this.removeDecisions} />
            {Object.keys(outcomes).length < 1 && <Banner message={this.state.message} onConfirm={this.handleAdd}/> }
      </div>);
    }
}

Decision.defaultProps = ({
    handleDecisions: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
    outcomes: [],
});

Decision.propTypes = ({
    handleDecisions: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
    outcomes: PropTypes.array,
});

export default Decision;