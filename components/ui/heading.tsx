import React from 'react'

const Heading = ({children} : {
    children : React.ReactNode
}) => {
  return (
    <h2 className="text-2xl font-bold mb-8" >
        {children}
    </h2>
  )
}

export default Heading
