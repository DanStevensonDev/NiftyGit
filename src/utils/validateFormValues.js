export const validateFormValues = (offerAmountInEth, commitUrl) => {
    // check offer amount is a number
    if (!Number(offerAmountInEth)) {
        return "Enter a number as your offer amount"
        // check offer is larger than minimum
    } else if (offerAmountInEth < 0.005) {
        return "Your offer must be higher than 0.005 Eth"
    } else if (!commitUrl.startsWith("https://www.github.com/")
        && !commitUrl.startsWith("https://github.com/")
        && !commitUrl.startsWith("www.github.com/")
        && !commitUrl.startsWith("github.com/")) {
        return "Copy and paste the full GitHub URL starting with \'https://github.com/\'"
    } else {
        const commitUrlDirectories = commitUrl.split("/").reverse()
    
        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]
    
        if (owner === undefined
            || repo === undefined
            || ref === undefined
            || owner === ""
            || repo === ""
            || ref === "") {
            return "Copy and paste a valid GitHub commit URL. e.g. https://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e"
        }
    }

    // if none of the above issues are met, return an empty string as the error message
    return ""
}