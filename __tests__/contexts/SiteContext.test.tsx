import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SiteProvider, useSite, useTheme } from '../../src/contexts/SiteContext'
import React from 'react'

// Test component to consume context
const TestComponent = () => {
  const { settings, theme, toggleTheme } = useSite()

  return (
    <div>
      <div data-testid="site-name">{settings?.site_name || 'No site name'}</div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

// Theme-specific test component
const ThemeTestComponent = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

describe('SiteContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document classes
    document.documentElement.className = ''
  })

  it('provides default values when no initial props are passed', () => {
    render(
      <SiteProvider>
        <TestComponent />
      </SiteProvider>
    )

    expect(screen.getByTestId('site-name')).toHaveTextContent('No site name')
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('provides initial settings when passed', () => {
    const mockSettings = {
      domain: 'test.com',
      site_name: 'Test Site',
      tagline: 'Test Tagline',
      description: 'Test Description'
    }

    render(
      <SiteProvider initialSettings={mockSettings}>
        <TestComponent />
      </SiteProvider>
    )

    expect(screen.getByTestId('site-name')).toHaveTextContent('Test Site')
  })

  it('toggles theme correctly', () => {
    render(
      <SiteProvider>
        <TestComponent />
      </SiteProvider>
    )

    const themeDisplay = screen.getByTestId('theme')
    const toggleButton = screen.getByTestId('toggle-theme')

    expect(themeDisplay).toHaveTextContent('light')

    fireEvent.click(toggleButton)

    expect(themeDisplay).toHaveTextContent('dark')

    fireEvent.click(toggleButton)

    expect(themeDisplay).toHaveTextContent('light')
  })

  it('applies theme class to document element', () => {
    render(
      <SiteProvider>
        <TestComponent />
      </SiteProvider>
    )

    const toggleButton = screen.getByTestId('toggle-theme')

    expect(document.documentElement.classList.contains('light')).toBe(true)

    fireEvent.click(toggleButton)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('persists theme preference in localStorage', () => {
    render(
      <SiteProvider>
        <TestComponent />
      </SiteProvider>
    )

    const toggleButton = screen.getByTestId('toggle-theme')

    fireEvent.click(toggleButton)

    expect(localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(toggleButton)

    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('loads theme from localStorage on initialization', () => {
    localStorage.setItem('theme', 'dark')

    render(
      <SiteProvider>
        <TestComponent />
      </SiteProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('useTheme hook works correctly', () => {
    render(
      <SiteProvider>
        <ThemeTestComponent />
      </SiteProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')

    fireEvent.click(screen.getByTestId('toggle-theme'))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useSite must be used within a SiteProvider')

    consoleSpy.mockRestore()
  })
})