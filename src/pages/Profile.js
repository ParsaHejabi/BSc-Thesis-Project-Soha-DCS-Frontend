import { gql, useQuery } from '@apollo/client'
import { useContext } from 'react'
import { AuthContext } from '../context/auth'
import { Table, Loader } from 'semantic-ui-react'
import moment from 'moment'

const GET_USER_REQUESTS = gql`
  query userRequest($username: String!) {
    userRequest(username: $username) {
      text
      possiblePoints
      points
      approved
      createdAt
    }
  }
`

const GET_USER_POINTS = gql`
  query user($id: ID!) {
    user(id: $id) {
      points
    }
  }
`

function Profile() {
  const { user } = useContext(AuthContext)
  const { loading, error, data } = useQuery(GET_USER_REQUESTS, {
    variables: { username: user.username },
  })

  const { error: userPointError, data: userPointsData } = useQuery(
    GET_USER_POINTS,
    {
      variables: { id: user.id },
    }
  )

  if (error || userPointError) {
    return (
      <div className="admin-form-container">
        <h1 className="page-title">
          مشکلی در اتصال به سرور به وجود آمده.
          <br />
          در حال بررسی و رفع مشکل هستیم.
          <br />
          لطفا دوباره تلاش کنید.
        </h1>
      </div>
    )
  }

  return (
    <div className="admin-form-container">
      <h1 className="page-title">{`${user.username} عزیز، خوش آمدید!`}</h1>
      <Loader active={loading} />
      {userPointsData && (
        <p className="rtl-p">
          {`مجموع امتیازات برای ورودی‌های تایید شده شما تا الآن: ${userPointsData.user.points}`}
        </p>
      )}
      <Table className="rtl-table-admin" striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>متن</Table.HeaderCell>
            <Table.HeaderCell>امتیاز احتمالی</Table.HeaderCell>
            <Table.HeaderCell>امتیاز نهایی</Table.HeaderCell>
            <Table.HeaderCell>زمان ارسال</Table.HeaderCell>
            <Table.HeaderCell>تایید شده؟</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data &&
            data.userRequest.map((value, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{value.text}</Table.Cell>
                  <Table.Cell>{value.possiblePoints}</Table.Cell>
                  <Table.Cell>{value.points}</Table.Cell>
                  <Table.Cell>{moment(value.createdAt).calendar()}</Table.Cell>
                  <Table.Cell>{value.approved ? 'بله' : 'خیر'}</Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Profile
