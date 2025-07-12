const fs = require('fs/promises');

const commands = {
  CREATE: 'create a file',
  DELETE: 'delete a file',
  RENAME: 'rename a file',
  ADD_TO_FILE: 'add to a file',
};

const getCommandFromOpenedFile = async (command_file) => {
  const { size } = await command_file.stat(); // get the size in bytes of the file
  const buff = Buffer.alloc(size); // allocate a buffer of the size of the file

  const offset = 0; // where to start filling from
  const length = buff.length; // how many bites to read
  const position = 0; // where to start reading from

  await command_file.read(buff, offset, length, position);

  const command = buff.toString().trim(); // toString() uses utf-8 encoding by default

  return command;
};

//______COMMAND_HANDLERS____________________________________________________
const createFile = async (path) => {
  // Check if the file already exists
  try {
    const isFileExists = await fs.open(path, 'r');

    if (isFileExists) {
      isFileExists.close();
      throw new Error(`File "${path}" already exists!`);
    }
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      const messg = err?.message || 'Error while checking file existence';
      console.error('Error: ' + messg);
      return;
    }
  }

  // Create the file
  try {
    const newFileHandler = await fs.open(path, 'w'); // "w" write mode, creates the file if it does not exist

    console.log(`Success: new file "${path}" created!`);

    await newFileHandler.close(); // close the file handler
  } catch (err) {
    console.error('Error: ' + err?.message || 'Error while creating file');
  }
};

const deleteFile = async (path) => {
  try {
    await fs.unlink(path);

    console.log(`Success: the file "${path}" was deleted.`);
  } catch (error) {
    console.error(`Error: deleting a file "${path}". ${error.message || ''}`);
  }
};

const renameFile = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);

    console.log(`Success: the file "${oldPath}" was renamed to "${newPath}"`);
  } catch (error) {
    console.error(
      `Error: renaming a file "${oldPath}". ${error.message || ''}`
    );
  }
};

const addToFile = async (path, content) => {
  // fs.appendFile allows to append data to a file, creating the file if it does not exist

  try {
    const file = await fs.open(path, 'r'); // throws err if file does not exist
    await file.close();

    await fs.appendFile(path, content);
    console.log(`Success: content added to the file "${path}"`);
  } catch (error) {
    console.error(`Error: adding to a file "${path}". ${error.message || ''}`);
  }
};

//_______COMMANDS_MANAGER___________________________________________________
const commandsHandler = async (command) => {
  // create a file <path>
  if (command.includes(commands.CREATE)) {
    const filePath = command.substring(commands.CREATE.length + 1).trim();

    await createFile(filePath);
    return;
  }

  // delete a file <path>
  if (command.includes(commands.DELETE)) {
    const filePath = command.substring(commands.DELETE.length + 1).trim();

    await deleteFile(filePath);
    return;
  }

  // rename a file <name> to <new_name>
  if (command.includes(commands.RENAME)) {
    const _index = command.indexOf(' to ');
    const oldFilePath = command.substring(commands.RENAME.length + 1, _index);
    const newFilePatch = command.substring(_index + 4);

    await renameFile(oldFilePath, newFilePatch);
    return;
  }

  // add to a file <path> this content: <content>
  if (command.includes(commands.ADD_TO_FILE)) {
    const startFilePath = commands.ADD_TO_FILE.length + 1;
    const endFilePath = command.indexOf(' this content: ');
    const path = command.substring(startFilePath, endFilePath);

    startContentInx = endFilePath + ' this content: '.length;
    const content = command.substring(startContentInx);

    await addToFile(path, content);
    return;
  }

  console.error(`Error: invalid command ===> "${command}"`);
};

//_______MAIN_SCRIPT________________________________________________________
(async () => {
  const watcher = fs.watch('./command.txt');

  // Open the file for reading
  const file_with_commands = await fs.open('./command.txt', 'r'); // "r" read mode

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      const command = await getCommandFromOpenedFile(file_with_commands);

      await commandsHandler(command);
    }
  }
})();
