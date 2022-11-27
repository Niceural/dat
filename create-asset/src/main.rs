extern crate dotenv;
use dotenv::dotenv;
use std::env;
use std::process::Command;
use std::io::{stdin, stdout, Read, Write};
#[macro_use]
extern crate dotenv_codegen;
use serde_json::{Number, Value};

fn pause() {
    let mut stdout = stdout();
    stdout.write(b"").unwrap();
    stdout.flush().unwrap();
    stdin().read(&mut [0]).unwrap();
}

fn main() {
    println!("Create asset application started...");
    dotenv().ok();

    println!("reading cli arguments...");
    let args: Vec<String> = env::args().collect();
    let collection_name = args[1].clone();
    let mut collection_metadata_file = args[1].clone();
    collection_metadata_file.push_str(".json");
    let nft_name = args[2].clone();
    let nft_uri = args[3].clone();
    let mut nft_metadata_file = args[2].clone();
    nft_metadata_file.push_str(".json");
    pause();
/*

    println!("Checking tznft installation...");
    Command::new("tznft")
        .arg("--version")
        .spawn() 
        .expect("Error: tznft not installed. Try installing it with \"npm install -g @oxheadalpha/tznft\"");
    pause();

    println!("Creating directory...");
    Command::new("mkdir")
        .arg("./tznft-cli")
        .spawn()
        .expect("Could not create directory.");
    pause();

    println!("Initializing tznft directory...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("init")
        .spawn()
        .expect("Failed to initialize directory");
    pause();

    println!("Connecting to tezos testnet...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("set-network")
        .arg("testnet")
        .spawn()
        .expect("Failed to set network to testnet");
    pause();

    println!("Creating collection metadata for \"{}\"...", &collection_name);
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("create-collection-meta")
        .arg(&collection_name)
        .spawn()
        .expect("Failed to create the collection.");
    pause();

    println!("Validating the metadata of \"{}\"...", &collection_name);
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("validate-collection-meta")
        .arg(&collection_metadata_file)
        .arg("--errors_only")
        .spawn()
        .expect("Failed to validate the metadata.");
    pause();

    println!("Originating nft collection \"{}\" contract...", &collection_name);
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("create-collection")
        .arg("alice")
        .arg("--meta_file")
        .arg(&collection_metadata_file)
        .arg("--alias")
        .arg(&collection_name)
        .spawn()
        .expect("Failed to originate NFT contract.");
    pause();

    println!("Preparing tokens metadata...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("create-nft-meta")
        .arg(&nft_name)
        .arg("alice")
        .arg(&nft_uri)
        .spawn()
        .expect("Failed to prepare tokens metadata.");
    pause();

    println!("Validating tokens metadata...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("validate-nft-meta")
        .arg(&nft_metadata_file)
        .arg("--errors_only")
        .spawn()
        .expect("Failed to verify tokens metadata.");
    pause();

    println!("Setting pinata api keys...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("set-pinata-keys")
        .arg(dotenv!("PINATA_API_KEY"))
        .arg(dotenv!("PINATA_API_SECRET"))
        .arg("--force")
        .spawn()
        .expect("Failed to set pinata api keys...");
    pause();

    println!("Pinning tokens metadata on IPFS");
    let mut output = Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("pin-file")
        .arg(&nft_metadata_file)
        .arg("--tag")
        .arg(&nft_name)
        .output()
        .expect("Failed to pin file to IPFS");
    output.stdout.pop();
    let ipfs_url = String::from_utf8_lossy(&output.stdout);
    println!("{}", &ipfs_url);
    pause();

    println!("Minting token...");
    let mut token_arg = String::from("1, ");
    token_arg.push_str(&*ipfs_url);
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("mint")
        .arg("alice")
        .arg(&collection_name)
        .arg("--tokens")
        .arg(&token_arg)
        .spawn()
        .expect("Failed to mint token.");
    pause();

*/
    // reading the contract address
    let config_file = String::from("./tznft-cli/tznft.json");
    let mut config = {
        let text = std::fs::read_to_string(&config_file).unwrap();
        serde_json::from_str::<Value>(&text).unwrap()
    };
    let nft_address = &config["availableNetworks"]["testnet"]["aliases"][&collection_name]["address"];
    println!("{}", &nft_address);
}
