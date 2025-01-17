import { useState } from 'react'

function hasValue(value: unknown) {
  return value !== undefined
}

function isFunction(value: unknown) {
  return typeof value === 'function'
}

type GetValue<T> = () => T

/**
 * 受控状态
 */
export function useControllerState<T, R = T>(
  defaultValue: T | GetValue<T>,
  option?: {
    defaultValue?: T | GetValue<T>
    value?: T
    onChange?: (value: T) => void
  }
): [R, (value: T) => void] {
  const { defaultValue: optionDefaultValue, value, onChange } = option || {}

  const [innerValue, setInnerValue] = useState<T>(() => {
    if (hasValue(value)) {
      return value
    } else if (hasValue(optionDefaultValue)) {
      return isFunction(optionDefaultValue) ? (optionDefaultValue as GetValue<T>)() : optionDefaultValue
    } else {
      return isFunction(defaultValue) ? (defaultValue as GetValue<T>)() : defaultValue
    }
  })
  const mergedValue = value !== undefined ? value : innerValue

  function handleChange(value: T) {
    setInnerValue(value)
    onChange?.(value)
  }

  return [mergedValue as unknown as R, handleChange]
}
