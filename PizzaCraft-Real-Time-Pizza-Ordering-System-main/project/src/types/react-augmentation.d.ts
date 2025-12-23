// This file augments React's type definitions to fix errors
import * as React from 'react';

declare module 'react' {
  // Fix for SVG props
  interface SVGProps<T> extends React.SVGAttributes<T> {
    children?: React.ReactNode;
  }

  // Fix for interface ModifierKey
  type ModifierKey =
    | "Alt"
    | "AltGraph"
    | "CapsLock"
    | "Control"
    | "Fn"
    | "FnLock"
    | "Hyper"
    | "Meta"
    | "NumLock"
    | "ScrollLock"
    | "Shift"
    | "Super"
    | "Symbol"
    | "SymbolLock";

  // Fix for truncated interfaces
  interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
    // Adding explicit empty body to override the truncated interface
  }

  interface StaticLifecycle<P, S> {
    // Adding explicit empty body to override the truncated interface
  }

  interface NewLifecycle<P, S, SS> {
    // Adding explicit empty body to override the truncated interface
  }
  
  // Fix HTML element attribute types
  interface DetailedHTMLProps<T, U> {
    className?: string;
    children?: React.ReactNode;
    id?: string;
  }
  
  // Fix specific HTML element attributes
  interface InputHTMLAttributes<T> {
    className?: string;
    id?: string;
    type?: string;
    value?: string | number | readonly string[] | undefined;
    checked?: boolean;
    required?: boolean;
    onChange?: React.ChangeEventHandler<T>;
    name?: string;
    min?: string | number;
    placeholder?: string;
  }
  
  interface LabelHTMLAttributes<T> {
    className?: string;
    children?: React.ReactNode;
    htmlFor?: string;
  }
  
  interface FormHTMLAttributes<T> {
    className?: string;
    children?: React.ReactNode;
    onSubmit?: React.FormEventHandler<T>;
  }
  
  interface ImgHTMLAttributes<T> {
    className?: string;
    src?: string;
    alt?: string;
  }
  
  interface TextareaHTMLAttributes<T> {
    className?: string;
    rows?: number;
  }
  
  interface ProgressHTMLAttributes<T> {
    className?: string;
  }
  
  interface LiHTMLAttributes<T> {
    children?: React.ReactNode;
  }
}

// Ensure this file is treated as a module
export {};
