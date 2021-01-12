import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Form, Message } from 'semantic-ui-react'

const GET_USER_REQUEST = gql`
  query getUserRequestWithId($id: ID!) {
    userRequestWithId(id: $id) {
      id
      user
      text
      type
      possibleReference
      properties
      place
      possiblePoints
      points
      approved
      createdAt
      updatedAt
    }
  }
`

const UPDATE_USER_REQUEST = gql`
  mutation updateUserRequest(
    $id: ID!
    $text: String!
    $type: RequestType
    $possibleReference: String
    $properties: [RequestProperty]
    $points: Int
    $approved: Boolean
  ) {
    updateUserRequest(
      adminUserRequestInput: {
        id: $id
        text: $text
        type: $type
        possibleReference: $possibleReference
        properties: $properties
        points: $points
        approved: $approved
      }
    ) {
      id
      user
      text
      type
      possibleReference
      properties
      place
      possiblePoints
      points
      approved
      createdAt
      updatedAt
    }
  }
`

function UserRequest(props) {
  const userRequestId = props.match.params.userRequestId

  const { loading, error, data } = useQuery(GET_USER_REQUEST, {
    variables: {
      id: userRequestId,
    },
  })

  const options = [
    { key: 'QUESTION', text: 'سوال', value: 'QUESTION' },
    { key: 'REQUEST', text: 'درخواست', value: 'REQUEST' },
    { key: 'OPINION', text: 'نظر / انتقاد و پیشنهاد', value: 'OPINION' },
    { key: 'OTHER', text: 'سایر', value: 'OTHER' },
    { key: 'EMPTY', text: 'نوع ورودی', value: '' },
  ]

  const [values, setValues] = useState({
    properties: [],
    text: '',
    type: '',
    possibleReference: '',
    possiblePoints: 0,
    points: 0,
    approved: false,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    data &&
      setValues({
        properties: data.userRequestWithId.properties,
        text: data.userRequestWithId.text,
        type: data.userRequestWithId.type,
        possibleReference: data.userRequestWithId.possibleReference,
        possiblePoints: data.userRequestWithId.possiblePoints,
        points: data.userRequestWithId.points,
        approved: data.userRequestWithId.approved,
      })
  }, [data])

  const [
    updateUserRequest,
    { loading: mutationLoading, data: mutationData },
  ] = useMutation(UPDATE_USER_REQUEST, {
    variables: {
      id: userRequestId,
      text: values.text,
      type: values.type,
      possibleReference: values.possibleReference,
      properties: values.properties,
      points: parseInt(values.points),
      approved: values.approved,
    },
    onCompleted: () => {
      setErrors({})
      // setValues({
      //   properties: [],
      //   text: '',
      //   type: '',
      //   possibleReference: '',
      //   possiblePoints: 0,
      //   points: 0,
      //   approved: false,
      // })
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.exception.errors.errors)
      // setValues({
      //   properties: [],
      //   text: '',
      //   type: '',
      //   possibleReference: '',
      //   possiblePoints: 0,
      //   points: 0,
      //   approved: false,
      // })
    },
  })

  const onChange = (event) => {
    if (errors.hasOwnProperty(event.target.name)) {
      if (event.target.value.trim() !== '') {
        let newErrors = errors
        delete newErrors[event.target.name]
        setErrors(newErrors)
      }
    }
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onChangeSelect = (event, data) => {
    setValues({ ...values, [data.name]: data.value })
  }

  const onChangeCheckbox = (event, data) => {
    if (event.target.checked) {
      let newProperties = values.properties
      newProperties.push(event.target.name)
      setValues({ ...values, properties: newProperties })
    } else {
      let newProperties = values.properties
      let index = newProperties.indexOf(event.target.name)
      if (index >= 0) {
        newProperties.splice(index, 1)
      }
      setValues({ ...values, properties: newProperties })
    }
  }

  const onChangeApproveCheckbox = (event, data) => {
    setValues({ ...values, approved: event.target.checked })
  }

  if (error)
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
    <div className="admin-form-container">
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          updateUserRequest()
        }}
        loading={loading || mutationLoading}
        success={mutationData && Object.keys(mutationData).length !== 0}
      >
        <Form.Group widths="equal" className="rtl-form-field">
          <Form.Select
            fluid
            name="type"
            label="نوع ورودی"
            options={options}
            placeholder="نوع ورودی"
            value={values.type}
            onChange={onChangeSelect}
            className="rtl-form-field"
          />
          <Form.Input
            fluid
            name="possibleReference"
            label="پاسخ‌دهنده احتمالی"
            placeholder="برای مثال معاون پژوهشی..."
            value={values.possibleReference}
            onChange={onChange}
            className="rtl-form-field"
          />
        </Form.Group>
        <Form.TextArea
          required
          name="text"
          label="متن ورودی"
          placeholder="درخواست، سوال، نظر و ... را اینجا وارد کنید..."
          value={values.text}
          onChange={onChange}
          error={
            errors.hasOwnProperty('text') && {
              content: errors.text,
              pointing: 'above',
            }
          }
          className="rtl-form-field"
        />
        <Form.Group className="rtl-form-field" inline>
          <label>این متن حاوی:</label>
          <Form.Input
            name="SARCASM"
            label="طعنه"
            onChange={onChangeCheckbox}
            control="input"
            type="checkbox"
            checked={values.properties.indexOf('SARCASM') >= 0}
          />
          <Form.Input
            name="HUMOR"
            label="طنز"
            onChange={onChangeCheckbox}
            control="input"
            type="checkbox"
            checked={values.properties.indexOf('HUMOR') >= 0}
          />
          <Form.Input
            name="INSULT"
            label="توهین"
            onChange={onChangeCheckbox}
            control="input"
            type="checkbox"
            checked={values.properties.indexOf('INSULT') >= 0}
          />
          <label>است.</label>
        </Form.Group>
        <Form.Group className="rtl-form-field">
          <Form.Input
            name="possiblePoints"
            label="امتیاز احتمالی"
            className="rtl-form-field"
            type="Number"
            readOnly
            value={values.possiblePoints}
          />
          <Form.Input
            name="points"
            label="امتیاز"
            onChange={onChange}
            className="rtl-form-field"
            type="Number"
            value={values.points}
          />
        </Form.Group>
        <Form.Input
          className="rtl-form-field"
          name="APPROVE"
          label="قابل تایید"
          onChange={onChangeApproveCheckbox}
          control="input"
          type="checkbox"
          checked={values.approved}
        />
        {mutationData && (
          <Message
            success
            header={`تغییرات انجام شد...`}
            className="rtl-form-field"
          />
        )}
        <Form.Button className="rtl-form-field" primary>
          ویرایش
        </Form.Button>
      </Form>
    </div>
  )
}

export default UserRequest
