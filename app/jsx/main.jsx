/** @jsx React.DOM */

var stage = document.querySelector("#stage");

// setup aws sdk
AWS.config.update({
    accessKeyId: "",
    secretAccessKey: ""
});

AWS.config.region = "ap-northeast-1";

var dynamodb = new AWS.DynamoDB();

/**
 * saveWord
 *
 * @param w1
 * @param w2
 * @param nw
 * @param callback
 * @return {undefined}
 */
var saveWord = function (w1, w2, nw, callback) {
    console.log(w1 + " + " + w2 + " = " + nw);

    var param = {
        Item: {
            wordId: {
                N: "1"
            },

            source1: {
                S: w1
            },

            source2: {
                S: w2
            },

            word: {
                S: nw
            }
        },
        TableName: "tangotango"
    };

    dynamodb.putItem(param, function (err, data) {
        callback(err, data);
    });
};

var TangoList = React.createClass({
    /**
     * render
     *
     * @return {undefined}
     */
    render: function () {
        var createItem = function (item) {
            return (
                <li>
                    ITEM
                </li>
            );
        };

        return (
            <ul>
                {this.props.items.map(createItem)}
            </ul>
        );
    }
});

var TangoForm = React.createClass({
    /**
     * getInitialState
     *
     * @return {undefined}
     */
    getInitialState: function () {
        return {
            word1: "word" + Math.random(),
            word2: "word" + Math.random(),
            newword: "",
            editable: true
        };
    },

    /**
     * render
     *
     * @return {undefined}
     */
    render: function () {
        return (
            <form>
                <div>{this.state.word1}</div>
                <div>{this.state.word2}</div>

                <input
                    type="text"
                    onChange={this.onChange}
                    value={this.state.newword}
                    disabled={!this.state.editable}
                />

                <button
                    type="button"
                    onClick={this.onClick}
                    disabled={!this.state.editable}
                >
                    generate
                </button>
            </form>
        );
    },

    /**
     * reload
     *
     * @return {undefined}
     */
    reload: function () {
        this.setState(this.getInitialState());
    },

    /**
     * onChange
     *
     * @param ev
     * @return {undefined}
     */
    onChange: function (ev) {
        this.setState({
            newword: ev.target.value
        });
    },

    /**
     * onClick
     *
     * @return {undefined}
     */
    onClick: function () {
        var self = this;

        this.setState({
            editable: false
        });

        saveWord(
            this.state.word1,
            this.state.word2,
            this.state.newword,
            function () {
                self.reload();
            }
        );
    }
});

dynamodb.getItem({
    Key: {
        wordId: {
            N: "1"
        }
    },
    TableName: "tangotango"
}, function (err, data) {
    if (err) {
        return console.error(err);
    }

    console.log(data);

    React.render(<TangoList />, document.getElementById("tango-list"));
});

React.render(<TangoForm />, stage);
