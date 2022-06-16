import {Component, ReactNode} from 'react'

interface IErrorBoundaryProps {
    children: ReactNode,
    handle: (e: Error) => ReactNode
}

interface IErrorBoundaryState {
    error: Error | null
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
      super(props)
      this.state = { error: null }
    }
  
    static getDerivedStateFromError(error: Error) {
      return { error }
    }
  
    render() {
      if (this.state.error) {
        return this.props.handle(this.state.error)
      }
      return this.props.children
    }
  }
