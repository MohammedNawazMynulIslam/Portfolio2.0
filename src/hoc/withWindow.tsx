"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import type { LucideIcon } from "lucide-react";
import {
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useWindowStore } from "@/store/windowStore";
import type { AppId, WindowPosition, WindowSize } from "@/types";

gsap.registerPlugin(Draggable);

const DEFAULT_POSITION: WindowPosition = { x: 0, y: 0 };

interface WindowFrameConfig {
  id: AppId;
  title: string;
  icon: LucideIcon;
  defaultSize: WindowSize;
}

interface WindowFrameProps {
  id: AppId;
  title: string;
  icon: LucideIcon;
  defaultSize: WindowSize;
  children: ReactNode;
}

function WindowFrame({
  id,
  title,
  icon: Icon,
  defaultSize,
  children,
}: WindowFrameProps) {
  const windowState = useWindowStore((state) => state.windows[id]);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const updatePosition = useWindowStore((state) => state.updatePosition);
  const updateSize = useWindowStore((state) => state.updateSize);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const titleBarRef = useRef<HTMLDivElement | null>(null);
  const resizeHandleRef = useRef<HTMLButtonElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef(defaultSize);
  const latestPositionRef = useRef({ x: 0, y: 0 });
  const latestSizeRef = useRef(defaultSize);
  const restoreFrameRef = useRef<{
    position: WindowPosition;
    size: WindowSize;
  } | null>(null);
  const previousOpenRef = useRef(windowState?.isOpen ?? false);
  const previousMinimizedRef = useRef(windowState?.isMinimized ?? false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const size = useMemo(() => windowState?.size ?? defaultSize, [defaultSize, windowState?.size]);
  const position = useMemo(
    () => windowState?.position ?? DEFAULT_POSITION,
    [windowState?.position],
  );
  const isVisible = Boolean(
    windowState && (shouldRender || (windowState.isOpen && !windowState.isMinimized)),
  );

  useEffect(() => {
    latestPositionRef.current = position;
  }, [position]);

  useEffect(() => {
    latestSizeRef.current = size;
  }, [size]);

  useEffect(() => {
    const element = windowRef.current;

    if (!element || !windowState) {
      return;
    }

    if (!windowState.isOpen && previousOpenRef.current) {
      gsap.killTweensOf(element);
      gsap.to(element, {
        scale: 0.85,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(element, { clearProps: "transform" });
          setShouldRender(false);
        },
      });
    }

    if (windowState.isOpen && windowState.isMinimized && !previousMinimizedRef.current) {
      gsap.killTweensOf(element);
      gsap.to(element, {
        y: 180,
        scale: 0.85,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(element, { clearProps: "transform" });
          setShouldRender(false);
        },
      });
    }

    previousOpenRef.current = windowState.isOpen;
    previousMinimizedRef.current = windowState.isMinimized;
  }, [windowState, shouldRender]);

  useIsomorphicLayoutEffect(() => {
    const element = windowRef.current;

    if (
      !element ||
      !windowState ||
      !isVisible ||
      !windowState.isOpen ||
      windowState.isMinimized
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.killTweensOf(element);
      gsap.fromTo(
        element,
        { scale: 0.85, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.22,
          ease: "back.out(1.45)",
        },
      );
    }, windowRef);

    return () => context.revert();
  }, [isVisible, windowState?.isMinimized, windowState?.isOpen]);

  useIsomorphicLayoutEffect(() => {
    const element = windowRef.current;
    const dragHandle = titleBarRef.current;
    const resizeHandle = resizeHandleRef.current;

    if (!element || !dragHandle || !resizeHandle || !windowState || !isVisible) {
      return;
    }

    const context = gsap.context(() => {
      const dragInstance = Draggable.create(element, {
        type: "x,y",
        trigger: dragHandle,
        onPress() {
          dragStartRef.current = { ...latestPositionRef.current };
          focusWindow(id);
        },
        onDragEnd() {
          const nextX = dragStartRef.current.x + this.x;
          const nextY = dragStartRef.current.y + this.y;
          updatePosition(id, nextX, nextY);
          setIsMaximized(false);
          restoreFrameRef.current = null;
          gsap.set(element, { x: 0, y: 0 });
        },
      })[0];

      const resizeInstance = Draggable.create(resizeHandle, {
        type: "x,y",
        onPress() {
          resizeStartRef.current = latestSizeRef.current;
          focusWindow(id);
        },
        onDrag() {
          const nextWidth = Math.max(defaultSize.w, resizeStartRef.current.w + this.x);
          const nextHeight = Math.max(defaultSize.h, resizeStartRef.current.h + this.y);
          updateSize(id, nextWidth, nextHeight);
          setIsMaximized(false);
          restoreFrameRef.current = null;
        },
        onDragEnd() {
          const nextWidth = Math.max(defaultSize.w, resizeStartRef.current.w + this.x);
          const nextHeight = Math.max(defaultSize.h, resizeStartRef.current.h + this.y);
          updateSize(id, nextWidth, nextHeight);
          setIsMaximized(false);
          restoreFrameRef.current = null;
          gsap.set(resizeHandle, { x: 0, y: 0 });
        },
      })[0];

      return () => {
        dragInstance.kill();
        resizeInstance.kill();
      };
    }, windowRef);

    return () => context.revert();
  }, [
    defaultSize.h,
    defaultSize.w,
    focusWindow,
    id,
    isVisible,
    updatePosition,
    updateSize,
    windowState?.isOpen,
    windowState?.isMinimized,
  ]);

  const handleFocus = () => {
    if (windowState?.isOpen && !windowState.isMinimized) {
      focusWindow(id);
    }
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShouldRender(true);
    closeWindow(id);
  };

  const handleMinimize = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShouldRender(true);
    minimizeWindow(id);
  };

  const handleMaximize = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    focusWindow(id);

    if (isMaximized && restoreFrameRef.current) {
      updatePosition(
        id,
        restoreFrameRef.current.position.x,
        restoreFrameRef.current.position.y,
      );
      updateSize(id, restoreFrameRef.current.size.w, restoreFrameRef.current.size.h);
      restoreFrameRef.current = null;
      setIsMaximized(false);
      return;
    }

    restoreFrameRef.current = {
      position: latestPositionRef.current,
      size: latestSizeRef.current,
    };

    const margin = 30;
    const topOffset = 44;
    const bottomOffset = 112;
    const nextWidth = Math.max(defaultSize.w, window.innerWidth - margin * 2);
    const nextHeight = Math.max(
      defaultSize.h,
      window.innerHeight - topOffset - bottomOffset,
    );

    updatePosition(id, margin, topOffset);
    updateSize(id, nextWidth, nextHeight);
    setIsMaximized(true);
  };

  const frameStyle = useMemo(
    () => ({
      left: position.x,
      top: position.y,
      width: size.w,
      height: size.h,
      zIndex: windowState?.zIndex ?? 1,
    }),
    [position.x, position.y, size.h, size.w, windowState?.zIndex],
  );

  if (!windowState || !isVisible) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="glass window-shadow absolute overflow-hidden rounded-2xl"
      style={frameStyle}
      onMouseDown={handleFocus}
    >
      <div
        ref={titleBarRef}
        className="glass-dark flex h-12 cursor-move select-none items-center justify-between border-b border-white/10 px-4"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Close ${title}`}
            className="h-3 w-3 rounded-full bg-[#FF5F57]"
            onClick={handleClose}
          />
          <button
            type="button"
            aria-label={`Minimize ${title}`}
            className="h-3 w-3 rounded-full bg-[#FEBC2E]"
            onClick={handleMinimize}
          />
          <button
            type="button"
            aria-label={`${isMaximized ? "Restore" : "Maximize"} ${title}`}
            className="h-3 w-3 rounded-full bg-[#28C840]"
            onClick={handleMaximize}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-white/90">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <div className="w-14" aria-hidden="true" />
      </div>

      <div className="relative h-[calc(100%-3rem)] overflow-hidden">
        {children}
        <button
          ref={resizeHandleRef}
          type="button"
          aria-label={`Resize ${title}`}
          className="absolute bottom-3 right-3 h-3 w-3 cursor-se-resize rounded-sm border border-white/25 bg-white/20"
          onMouseDown={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
}

export function withWindow<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: WindowFrameConfig,
) {
  function WithWindowComponent(props: P) {
    return (
      <WindowFrame
        id={config.id}
        title={config.title}
        icon={config.icon}
        defaultSize={config.defaultSize}
      >
        <WrappedComponent {...props} />
      </WindowFrame>
    );
  }

  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  WithWindowComponent.displayName = `withWindow(${displayName})`;

  return WithWindowComponent;
}
