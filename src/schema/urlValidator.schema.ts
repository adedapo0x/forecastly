import { z } from "zod"

export const urlValidationSchema = z.object({
    location: z.string().min(1, "Location is required"),
    date1: z.string().optional()
            .transform((val) => val ? new Date(val) : undefined)
            .refine((date) => !date || !isNaN(date.getTime()), {
                message: "Invalid date1 format"
            }),
    date2: z.string().optional().
            transform((val) => val ? new Date(val): undefined).
            refine((date) => !date || !isNaN(date.getTime()), {
                message: "Invalid date2 format"
            })
})

export type UrlValidatorType = z.infer<typeof urlValidationSchema>;