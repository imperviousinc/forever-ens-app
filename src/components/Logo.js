import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

import ForeverLogo from '../assets/forever-logo.png'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 76px;
  ${mq.medium`
    width: 76px
  `}
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: auto;

  ${mq.medium`
    width: 150px;
  `}
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ForeverLogo} />
  </LogoContainer>
)

export default Logo
