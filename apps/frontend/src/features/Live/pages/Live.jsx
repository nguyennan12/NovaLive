import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { LiveFeed } from '../components/LiveFeed'
const Live = () => {
  const currentUser = useSelector(selectCurrentUser)
  return <LiveFeed userId={currentUser._id} />
}

export default Live