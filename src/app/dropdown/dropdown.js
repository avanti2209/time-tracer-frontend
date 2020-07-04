import React from 'react';
import './dropdown.css';

export default class Dropdown extends React.PureComponent {

    constructor() {
        super(...arguments);
        this.state = {
            open: false
        };
    }

    toggleDroop() {
        let body = document.querySelector('body');
        var callback = function () {
            this.setState({
                open: false
            });
        };
        if (this.state.open) {
            body.removeEventListener('click', callback.bind(this))
        } else {
            body.addEventListener('click', callback.bind(this));
        }
        this.setState({
            open: !this.state.open
        });
    }

    onOptionsClick(e) {
        const targetted = e.target;
        const selected = targetted.getAttribute('data-option');

        const options = this.props.options.map(({ label }) => {
            return {
                label,
                active: selected === label
            };
        });
        this.props.onChange(options);

        const droopListIsOpen = document.querySelector(`#${this.props.name} .droop-list.open`);
        if (droopListIsOpen) this.toggleDroop();
    }

    render() {
        const { options, placeHolder } = this.props;

        const selected = options.find(e => {
            return e.active;
        });

        const showPlaceHolder = !selected;

        return <div className="droop" id={this.props.name}>

            <p onClick={this.toggleDroop.bind(this)}
                className={`droop-label ${showPlaceHolder ? 'placeholder' : ''}`}>
                &nbsp;{showPlaceHolder ? placeHolder : selected.label}
                <span className={`arrow-icon ${this.state.open ? 'rotate' : ''}`} />
            </p>

            <ul className={`droop-list ${this.state.open ? 'open' : 'false'}`}
                ref={(node) => { this.droopList = node;}}>
                {
                    options.map(option => {
                        return !option.active ?
                            <li onClick={this.onOptionsClick.bind(this)}
                                data-option={option.label}
                                key={option.label}>
                                {option.label}
                            </li>
                            :
                            null;
                    })
                }
            </ul>
        </div>
    }
}