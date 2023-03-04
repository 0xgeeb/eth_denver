import React, {useEffect} from 'react'
import DomainsList from './DomainsList'
import ExploreDomains from './ExploreDomains'

export default function MainPage({web3}) {

  return (
    <div className='Main-Page-Container'>
        <DomainsList web3={web3} />
        <ExploreDomains web3={web3} />
    </div>
  )
}
