import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();
  const moveCountRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noButtonRef.current || showSuccess) return;

      const button = noButtonRef.current;
      const rect = button.getBoundingClientRect();
      const buttonCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      const mousePos = { x: e.clientX, y: e.clientY };
      const distance = Math.sqrt(
        Math.pow(mousePos.x - buttonCenter.x, 2) + 
        Math.pow(mousePos.y - buttonCenter.y, 2)
      );

      // If mouse is within 100px of button, move it
      if (distance < 100) {
        // Hide tooltip and reset counter when user starts chasing again
        if (showTooltip) {
          setShowTooltip(false);
          moveCountRef.current = 0;
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = undefined;
          }
        }

        moveCountRef.current++;
        const moveX = (Math.random() - 0.5) * 300; // Random between -150 and 150
        const moveY = (Math.random() - 0.5) * 300;

        controls.start({
          x: moveX,
          y: moveY,
          transition: { duration: 0.1 }  // Quick movement without spring physics
        });

        // Show tooltip after 5 moves
        if (moveCountRef.current === 5 && !tooltipTimeoutRef.current) {
          tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
          }, 1000);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [controls, showSuccess, showTooltip]);

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 flex flex-col items-center gap-8">
          {!showSuccess ? (
            <>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Do you like me?
              </h1>

              <div className="flex gap-4 items-center justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  onClick={handleYesClick}
                >
                  Yes!
                </Button>

                <motion.div
                  animate={controls}
                  style={{ position: "relative" }}
                >
                  <TooltipProvider>
                    <Tooltip open={showTooltip}>
                      <TooltipTrigger asChild>
                        <Button
                          ref={noButtonRef}
                          variant="outline"
                          size="lg"
                        >
                          No
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">LOL Press Me If You Can! 😜</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Heart className="w-16 h-16 text-pink-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Thanks, I like you too!!
              </h2>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}