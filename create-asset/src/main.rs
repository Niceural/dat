extern crate dotenv;
extern crate mktemp;
use mktemp::Temp;
use dotenv::dotenv;
use std::env;
use std::process::Command;
use std::{fs, io, io::stdin, io::stdout, io::Read, io::Write, fs::File, path::Path};
#[macro_use]
extern crate dotenv_codegen;
use serde_json::{Number, Value};

fn pause() {
    let mut stdout = stdout();
    stdout.write(b"").unwrap();
    stdout.flush().unwrap();
    stdin().read(&mut [0]).unwrap();
}

/*
fn prepend_file<P: AsRef<Path>>(data: &[u8], file_path: &P) -> io::Result<()> {
    // Create a temporary file 
    let mut tmp_path = Temp::new_file()?;
    // Stop the temp file being automatically deleted when the variable
    // is dropped, by releasing it.
    // tmp_path.release();
    // Open temp file for writing
    let mut tmp = File::create(&tmp_path)?;
    // Open source file for reading
    let mut src = File::open(&file_path)?;
    // Write the data to prepend
    tmp.write_all(&data)?;
    // Copy the rest of the source file
    io::copy(&mut src, &mut tmp)?;
    fs::remove_file(&file_path)?;
    fs::rename(&tmp_path, &file_path)?;
    Ok(())
}
*/

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

    println!("Transferring the NFT to the customer...");
    Command::new("tznft")
        .current_dir("./tznft-cli")
        .arg("transfer")
        .arg("--nft")
        .arg(&collection_name)
        .arg("--signer")
        .arg("alice")
        .arg("--batch")
        .arg("alice, bob, 1")
        .spawn()
        .expect("Failed to transfer the nft.");

    // reading the contract address
    let token_id = String::from("1");
    let config_file = String::from("./tznft-cli/tznft.json");
    let mut config = {
        let text = std::fs::read_to_string(&config_file).unwrap();
        serde_json::from_str::<Value>(&text).unwrap()
    };
    let nft_address: String = match &config["availableNetworks"]["testnet"]["aliases"][&collection_name]["address"] {
        Value::String(addr) => addr.clone(),
        _ => panic!("Could not read address from \"tznft.json\""),
    };
    println!("NFT address read from \"tznft.json\": {}", &nft_address);
    pause();

    // write address to arduino sketch
    let mut line_to_write = String::from("byte blockData1 [16] = {\"");
    line_to_write.push_str(&nft_address[0..16]);
    line_to_write.push_str("\"};byte blockData2 [16] = {\"");
    line_to_write.push_str(&nft_address[16..32]);
    line_to_write.push_str("\"};byte blockData3 [16] = {\"");
    line_to_write.push_str(&nft_address[32..36]);
    line_to_write.push_str("------------\"};byte blockData4 [16] = {\"");
    line_to_write.push_str(&token_id);
    line_to_write.push_str("---------------\"};\n");
    println!("Line to write to arduino sketch: {}", &line_to_write);
    let original_file_path = "./arduino/writeRfid/writeRfid.ino";
    let original_content: String = fs::read_to_string(&original_file_path)
        .expect("Failed to read arduino sketch");
        // .parse()
        // .expect("Failed to parse content");
    // println!("{}", original_content);
    let temp_file_path = "./arduino/writeRfid/foo.ino";
    let mut temp = File::create(&temp_file_path).expect("Failed to create temp file");
    temp.write(&line_to_write.as_bytes()).expect("Failed to write to file");
    temp.write(&original_content.as_bytes()).expect("Failed to write to file");
    fs::remove_file(&original_file_path).expect("Failed to remove file");
    fs::rename(&temp_file_path, &original_file_path).expect("Failed to rename file");
    pause();

    println!("Compiling arduino sketch...");
    Command::new("arduino-cli")
        .current_dir("./arduino")
        .arg("compile")
        .arg("--fqbn")
        .arg("arduino:avr:uno")
        .arg("writeRfid")
        .spawn()
        .expect("Failed to compile sketch");
    pause();

    println!("Uploading sketch on arduino...");
    Command::new("arduino-cli")
        .current_dir("./arduino")
        .arg("upload")
        .arg("-p")
        .arg("/dev/ttyACM0")
        .arg("--fqbn")
        .arg("arduino:avr:uno")
        .arg("writeRfid")
        .spawn()
        .expect("Failed to upload sketch on arduino");
    pause();
}
