"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const MobileMenuDialog = DialogPrimitive.Root

const MobileMenuDialogTrigger = DialogPrimitive.Trigger

const MobileMenuDialogPortal = DialogPrimitive.Portal

const MobileMenuDialogClose = DialogPrimitive.Close

const MobileMenuDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
MobileMenuDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const MobileMenuDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <MobileMenuDialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </MobileMenuDialogPortal>
))
MobileMenuDialogContent.displayName = DialogPrimitive.Content.displayName

const MobileMenuDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
MobileMenuDialogHeader.displayName = "DialogHeader"

const MobileMenuDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
MobileMenuDialogFooter.displayName = "DialogFooter"

const MobileMenuDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
MobileMenuDialogTitle.displayName = DialogPrimitive.Title.displayName

const MobileMenuDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
MobileMenuDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  MobileMenuDialog,
  MobileMenuDialogPortal,
  MobileMenuDialogOverlay,
  MobileMenuDialogTrigger,
  MobileMenuDialogClose,
  MobileMenuDialogContent,
  MobileMenuDialogHeader,
  MobileMenuDialogFooter,
  MobileMenuDialogTitle,
  MobileMenuDialogDescription,
}
