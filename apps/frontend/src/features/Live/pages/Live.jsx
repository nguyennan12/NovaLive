import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/common/redux/user/userSlice'
import { LiveFeed } from '../components/LiveFeed'
import AppBar from '~/common/components/layout/AppBar/AppBar'
const Live = () => {
  const currentUser = useSelector(selectCurrentUser)
  return <>
    <LiveFeed userId={currentUser._id} />
  </>

}

export default Live