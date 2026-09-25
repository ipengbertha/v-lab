<?php

namespace Tests\Unit;

use App\Services\CalculationEngine;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class CalculationEngineTest extends TestCase
{
    private CalculationEngine $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = new CalculationEngine();
    }

    public function test_ohm_basic_calculation(): void
    {
        $result = $this->engine->calculate('ohm', ['V' => 12, 'R' => 6]);
        $this->assertEquals(2, $result['I']);
    }

    public function test_ohm_with_decimal_result(): void
    {
        $result = $this->engine->calculate('ohm', ['V' => 10, 'R' => 3]);
        $this->assertEquals(3.3333, $result['I']);
    }

    public function test_ohm_rejects_zero_resistance(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->engine->calculate('ohm', ['V' => 12, 'R' => 0]);
    }

    public function test_ohm_rejects_negative_resistance(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->engine->calculate('ohm', ['V' => 12, 'R' => -5]);
    }

    public function test_ohm_rejects_negative_voltage(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->engine->calculate('ohm', ['V' => -5, 'R' => 6]);
    }

    public function test_ohm_rejects_non_numeric_input(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->engine->calculate('ohm', ['V' => 'abc', 'R' => 6]);
    }

    public function test_unknown_formula_throws_exception(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->engine->calculate('unknown_formula', ['V' => 12, 'R' => 6]);
    }
}