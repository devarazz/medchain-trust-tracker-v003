// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Replace the contents of your existing module (LockModule)
export default buildModule("BatchRegistryModule", (m) => {
  const batchRegistry = m.contract("BatchRegistry");

  return { batchRegistry };
});
