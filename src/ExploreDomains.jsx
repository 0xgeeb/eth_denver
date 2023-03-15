import React, {useState, useEffect} from 'react'
import { ethers } from "ethers"
import constants from "./constants/constants";
import ExploreDomainsRight from "./ExploreDomainsRight";
import Modal from 'react-modal';


const MANAGER_ADDRESS = constants.address.manager;
const MANAGER_ABI = constants.abi.manager;
const NAME_WRAPPER_ADDRESS = constants.address.nameWrapper;

export default function ExploreDomains({ web3 }) {
  const [ownedEns, setOwnedEns] = useState(null);
  const [isEnsSelected, setIsEnsSelected] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedEns, setSelectedEns] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchEnsNames() {
      if (web3.active) {
        const ensArray = [];
        const signer = web3.library.getSigner();
        const contract = new ethers.Contract(
          MANAGER_ADDRESS,
          MANAGER_ABI,
          signer
        );
        const internalId = await contract.internalId();
        for (let i = 0; i < internalId; i++) {
          const domainObject = await contract.domainsInfoArray(i);
          if (domainObject.inThisContract) {
            ensArray.push(domainObject)
          }
        }
        setOwnedEns(ensArray);
      }
    }
    fetchEnsNames();
  }, [web3.active]);

  async function handleSelectEns(e) {
    e.preventDefault();
    setSelectedEns(e.target.value);
    setIsEnsSelected(true);
    setSelectedDomain(e.target.value);
    for (let i = 0; i < ownedEns.length; i++) {
      if (ownedEns[i][0] === e.target.value) {
        setTokenId(ownedEns[i].nameWrapperTokenId.toString());
      }
    }
 }

function openModal() {
  setModalIsOpen(true);
}
    
function closeModal() {
   setModalIsOpen(false); 
 }


  return (
    <div className='domains-list-container'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className='what-is-explore-heading'>What is the Explore Domains Contract?</h2>
        <p className='what-is-explore-content'>The Explore Domains Contract encompasses wrapped ENS names that have been contributed by users. Anyone has the opportunity to obtain a complimentary subdomain from these available names.</p>
        <button onClick={closeModal} className="modal-close-button">Close</button>
      </Modal>
      {isEnsSelected ? (
            <div>
              <button onClick={() => setIsEnsSelected(false)} className="back-to-domains-button">Back To Explore List</button>
              <hr />
              <ExploreDomainsRight web3={web3} name={selectedDomain} tokenId={tokenId} />
            </div>
          ) : (
            <div>
              <h1 className="domains-list-header">Explore Domains<span className="whats-this" onClick={openModal}>What's this</span></h1>
              {ownedEns && (
                <form>
                  <div className="ens-domains-container">
                    {ownedEns.map((ens) => {
                      return (
                        <div className="domains-name-container" key={ens.name}>
                        <input
                          type="radio"
                          id={ens.name}
                          name="ens_option"
                          value={ens.name}
                          className="domains-list-button"
                          onClick={(e) => handleSelectEns(e)}
                        />
                        <label className="domains-list-button" htmlFor={ens.name}>
                          {ens.name}
                        </label>
                        </div>
                      );
                    })}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
  );
}