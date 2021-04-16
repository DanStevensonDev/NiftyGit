
exports.up = function (knex) {
    console.log("creating table...")
    return knex.schema.createTable("commit_nft_bids", commitNftBidsTable => {
        commitNftBidsTable.increments("bid_id").primary()
        commitNftBidsTable.string("committer_username")
        commitNftBidsTable.string("commit_url")
        commitNftBidsTable.string("commit_sha")
        commitNftBidsTable.bigInteger("time_requested")
        commitNftBidsTable.string("supporter_wallet_address")
        commitNftBidsTable.float("support_amount_in_ether")
        commitNftBidsTable.string("transaction_hash")
        commitNftBidsTable.boolean("previously_sold")
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable("commit_nft_bids")
};
