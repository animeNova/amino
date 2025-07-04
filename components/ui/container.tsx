import React from 'react'

const Container = ({
    children
} : {
    children : React.ReactNode
}) => {
  return (
    <div className='mt-14'>
      {children}
    </div>
  )
}

export default Container
