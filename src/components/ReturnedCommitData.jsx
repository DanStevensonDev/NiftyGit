import React, { Component } from 'react';

class ReturnedCommitData extends Component {
    render() {
        const { checkCommitData } = this.props
        console.log(checkCommitData)
        if (checkCommitData.commitFetchError === true) {
            return (
                <div>
                    Error fetching commit
                </div>
            );
        } else if (checkCommitData.commitFetchError === false) {
            return (
                <div>
                    Committer: {checkCommitData.returnedCommitData.commit.committer.name}
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default ReturnedCommitData;