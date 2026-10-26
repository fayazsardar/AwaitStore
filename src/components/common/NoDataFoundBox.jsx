import React, { lazy, Suspense } from 'react'

// The Lottie player is large, so it is only downloaded when an empty state is shown
const EmptyBoxAnimation = lazy(async () => {
  const [{ default: Lottie }, { default: animationData }] = await Promise.all([
    import('lottie-react'),
    import('../../assets/animation/Empty Box.json'),
  ])
  return { default: (props) => <Lottie animationData={animationData} {...props} /> }
})

const NoDataFoundBox = () => {
  return (
    <div className=" flex flex-col items-center w-full justify-center">
                   <Suspense fallback={<div className="w-48 h-48" />}>
                     <EmptyBoxAnimation loop={true} className="w-48 h-48" />
                   </Suspense>
                   <h1 className="text-gray-700"> No available Data Found</h1>

                 </div>
  )
}

export default NoDataFoundBox
