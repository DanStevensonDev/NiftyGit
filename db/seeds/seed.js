const { commitNftBidsData } = require("../data/index.js")

exports.seed = function (knex) {
    return knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => {
            return knex
                .insert(commitNftBidsData)
                .into("commit_nft_bids")
                .returning("*")
        })
}