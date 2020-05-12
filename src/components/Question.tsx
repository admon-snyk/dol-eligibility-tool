import React, { useContext, useEffect } from 'react'
import { Question as QuestionInterface } from '../lib/types'
import { getComponent, getSwitch } from '../forms'
import { getSections } from '../lib/sections'
import { Box, Heading, Text } from 'grommet'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components'

interface Props {
  question: QuestionInterface
}

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component = getComponent(question.type)

  const { values, errors, form, translateCopy, translateByID } = useContext(FormContext)

  const value = values[question.id]
  const error = errors[question.id]
  let switchComponent: HTMLDivElement | null

  useEffect(() => {
    if (value && form.variables?.autoscroll) {
      switchComponent?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [value])

  // If question is "sections" but there are no sections, don't render.
  if (question.type === 'sections' && getSections(question.sections, form, values).length === 0) {
    return <Box />
  }

  return (
    <Box direction="column" margin={{ top: question.type === 'sections' ? 'none' : '48px' }}>
      {(question.name || question.instructions) && (
        <Box fill={true} className="question-heading-box" pad={{ horizontal: 'large' }} margin={{ bottom: '16px' }}>
          {question.name && (
            <Box direction="row" align="start">
              <Heading
                style={{
                  maxWidth: 'none',
                }}
                level={4}
                margin={{ horizontal: 'none', top: 'none', bottom: question.instructions ? '8px' : 'none' }}
              >
                {translateCopy(question.name)}
                {!question.required && !['instructions-only', 'sections'].includes(question.type) && (
                  <em> ({translateByID('optional')})</em>
                )}
              </Heading>
            </Box>
          )}
          {question.instructions && <Markdown size="small">{translateCopy(question.instructions)}</Markdown>}
        </Box>
      )}

      <Component question={question} />
      {error && (
        <Box pad={{ horizontal: 'large' }}>
          {error.map((e) => (
            <Text key={e.en} margin={{ top: 'xsmall' }} color="#E42906">
              {translateCopy(e)}
            </Text>
          ))}
        </Box>
      )}
      <Box ref={(el) => (switchComponent = el)}>
        {question.switch &&
          getSwitch(question.switch, value as string | string[])?.map((q) => <Question question={q} key={q.id} />)}
      </Box>
    </Box>
  )
}

export default Question
