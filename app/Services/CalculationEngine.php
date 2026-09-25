<?php

namespace App\Services;

use InvalidArgumentException;

class CalculationEngine
{
    /**
     * Titik masuk utama. $formulaKey sesuai kolom experiments.formula_key.
     * $inputs contoh: ['V' => 12, 'R' => 6]
     * Return contoh: ['I' => 2]
     */
    public function calculate(string $formulaKey, array $inputs): array
    {
        return match ($formulaKey) {
            'ohm' => $this->ohm($inputs),
            default => throw new InvalidArgumentException("Rumus '{$formulaKey}' belum didukung."),
        };
    }

    private function ohm(array $inputs): array
    {
        $v = $inputs['V'] ?? null;
        $r = $inputs['R'] ?? null;

        if (! is_numeric($v) || ! is_numeric($r)) {
            throw new InvalidArgumentException('V dan R wajib berupa angka.');
        }

        if ((float) $r <= 0) {
            throw new InvalidArgumentException('R harus lebih besar dari 0.');
        }

        if ((float) $v < 0) {
            throw new InvalidArgumentException('V tidak boleh negatif.');
        }

        $i = round((float) $v / (float) $r, 4);

        return ['I' => $i];
    }
}