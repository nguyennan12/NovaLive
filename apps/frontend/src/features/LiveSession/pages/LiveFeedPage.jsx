import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/common/redux/user/userSlice'
import { LiveFeed } from '../components/LiveFeedPage/LiveFeed'

const LiveFeedPage = () => {
  const currentUser = useSelector(selectCurrentUser)
  return <>
    <LiveFeed userId={currentUser._id} />
  </>

}

export default LiveFeedPage