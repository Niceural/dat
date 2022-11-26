use std::env;
use std::process::Command;

fn main() {
    println!("create asset application started...");
    
    println!("reading cli arguments...");
    let args: Vec<String> = env::args().collect();

    println!("connecting to tezos testnet...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("set-network")
        .arg("testnet")
        .spawn()
        .expect("failed to set network to testnet");

    println!("");
}

