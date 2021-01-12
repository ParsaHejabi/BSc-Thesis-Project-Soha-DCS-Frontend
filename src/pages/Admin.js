import { useQuery, gql } from '@apollo/client'
import { Table, Button, Tab } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

const GET_UNQPPROVED_USER_REQUESTS = gql`
  query unapprovedUserRequests {
    unapprovedUserRequests {
      id
      user
      text
      possiblePoints
      points
      createdAt
      updatedAt
    }
  }
`

const GET_ALL_USER_REQUESTS = gql`
  query allUserRequests {
    allUserRequests {
      id
      user
      text
      possiblePoints
      points
      approved
      createdAt
      updatedAt
    }
  }
`

function Admin() {
  let { error, loading, data } = useQuery(GET_UNQPPROVED_USER_REQUESTS)
  let {
    error: allUserRequestsError,
    loading: allUserLoading,
    data: allUserRequestsData,
  } = useQuery(GET_ALL_USER_REQUESTS)

  const panes = [
    {
      menuItem: 'همه‌ی ورودی‌ها',
      render: () => (
        <Tab.Pane loading={allUserLoading}>
          <div className="admin-form-container">
            <Table className="rtl-table-admin" striped selectable>
              <Table.Header>
                <Table.Row>
                  {/* <Table.HeaderCell>ردیف</Table.HeaderCell> */}
                  <Table.HeaderCell>متن</Table.HeaderCell>
                  <Table.HeaderCell>امتیاز احتمالی</Table.HeaderCell>
                  <Table.HeaderCell>امتیاز نهایی</Table.HeaderCell>
                  <Table.HeaderCell>زمان ارسال</Table.HeaderCell>
                  <Table.HeaderCell>عملیات</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {allUserRequestsData &&
                  allUserRequestsData.allUserRequests.map((value, index) => {
                    return (
                      <Table.Row key={index}>
                        {/* <Table.Cell>{index + 1}</Table.Cell> */}
                        <Table.Cell>{value.text}</Table.Cell>
                        <Table.Cell>{value.possiblePoints}</Table.Cell>
                        <Table.Cell>{value.points}</Table.Cell>
                        <Table.Cell>
                          {moment(value.createdAt).calendar()}
                        </Table.Cell>
                        <Table.Cell>
                          {!value.approved && (
                            <Button
                              className="rtl-button"
                              primary
                              as={Link}
                              to={`/userrequests/${value.id}`}
                            >
                              ویرایش
                            </Button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'ورودی‌های تایید نشده',
      render: () => (
        <Tab.Pane loading={loading}>
          <div className="admin-form-container">
            <Table className="rtl-table-admin" striped selectable>
              <Table.Header>
                <Table.Row>
                  {/* <Table.HeaderCell>ردیف</Table.HeaderCell> */}
                  <Table.HeaderCell>متن</Table.HeaderCell>
                  <Table.HeaderCell>امتیاز احتمالی</Table.HeaderCell>
                  <Table.HeaderCell>زمان ارسال</Table.HeaderCell>
                  <Table.HeaderCell>عملیات</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data &&
                  data.unapprovedUserRequests.map((value, index) => {
                    return (
                      <Table.Row key={index}>
                        {/* <Table.Cell>{index + 1}</Table.Cell> */}
                        <Table.Cell>{value.text}</Table.Cell>
                        <Table.Cell>{value.possiblePoints}</Table.Cell>
                        <Table.Cell>
                          {moment(value.createdAt).calendar()}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            className="rtl-button"
                            primary
                            as={Link}
                            to={`/userrequests/${value.id}`}
                          >
                            ویرایش
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table>
          </div>
        </Tab.Pane>
      ),
    },
  ]
  if (error || allUserRequestsError)
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

  return (
    <>
      <h1 className="page-title">ادمین</h1>
      <Tab panes={panes} className="admin-tab" />
    </>
  )
}

export default Admin
